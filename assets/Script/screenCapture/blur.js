var _default_vert = `
attribute vec4 a_position;
attribute vec2 a_texCoord;
attribute vec4 a_color;

varying vec2 v_texCoord;
varying vec4 v_fragmentColor;

void main()
{
    gl_Position = ( CC_PMatrix * CC_MVMatrix ) * a_position;
    v_fragmentColor = a_color;
    v_texCoord = a_texCoord;
}
` 
var _default_vert_no_mvp = `
attribute vec4 a_position;
 attribute vec2 a_texCoord;
 attribute vec4 a_color;
 varying vec2 v_texCoord;
 varying vec4 v_fragmentColor;

 void main()
 {
     gl_Position = CC_PMatrix  * a_position;
     v_fragmentColor = a_color;
     v_texCoord = a_texCoord;
 }
`
var _blur_edge_detail_frag = `
#ifdef GL_ES
precision mediump float;
#endif

varying vec2 v_texCoord;

uniform float widthStep;
uniform float heightStep;
uniform float strength;
const float blurRadius = 2.0;
const float blurPixels = (blurRadius * 2.0 + 1.0) * (blurRadius * 2.0 + 1.0);

void main()
{
    vec3 sumColor = vec3(0.0, 0.0, 0.0);
    for(float fy = -blurRadius; fy <= blurRadius; ++fy)
    {
        for(float fx = -blurRadius; fx <= blurRadius; ++fx)
        {
            vec2 coord = vec2(fx * widthStep, fy * heightStep);
            sumColor += texture2D(CC_Texture0, v_texCoord + coord).rgb;
        }
    }
    gl_FragColor = vec4(mix(texture2D(CC_Texture0, v_texCoord).rgb, sumColor / blurPixels, strength), 1.0);
}
`

cc.Class({
    extends: cc.Component,

    properties: {
            
    },

    onLoad: function () {
        this._use();
    },

    _use: function()
    {
        this._program = new cc.GLProgram();
        if (cc.sys.isNative) {
            cc.log("use native GLProgram")
            this._program.initWithString(_default_vert_no_mvp, _blur_edge_detail_frag);
            this._program.link();
            this._program.updateUniforms();
        }else{
            this._program.initWithVertexShaderByteArray(_default_vert, _blur_edge_detail_frag);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_POSITION, cc.macro.VERTEX_ATTRIB_POSITION);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_COLOR, cc.macro.VERTEX_ATTRIB_COLOR);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_TEX_COORD, cc.macro.VERTEX_ATTRIB_TEX_COORDS);
            this._program.link();
            this._program.updateUniforms();
        }
        
        this._uniWidthStep = this._program.getUniformLocationForName( "widthStep" );
        this._uniHeightStep = this._program.getUniformLocationForName( "heightStep" );
        this._uniStrength = this._program.getUniformLocationForName( "strength" );

        if (cc.sys.isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this._program);
            glProgram_state.setUniformFloat( this._uniWidthStep , ( 1/ this.node.getContentSize().width ) );
            glProgram_state.setUniformFloat( this._uniHeightStep , ( 1 / this.node.getContentSize().height ) );
            glProgram_state.setUniformFloat(  this._uniStrength, 0.8);//0.5
        }else{
            this._program.setUniformLocationWith1f( this._uniWidthStep, ( 1.0 / this.node.getContentSize().width ) );
            this._program.setUniformLocationWith1f( this._uniHeightStep, ( 1.0 / this.node.getContentSize().height ) );
            
            /* 模糊 0.5     */
            /* 模糊 1.0     */
            /* 细节 -2.0    */
            /* 细节 -5.0    */
            /* 细节 -10.0   */
            /* 边缘 2.0     */
            /* 边缘 5.0     */
            /* 边缘 10.0    */
            this._program.setUniformLocationWith1f( this._uniStrength, 1.0 );
        }
        
        this.setProgram( this.node._sgNode, this._program );
    },
    setProgram:function (node, program) {
        if (cc.sys.isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(program);
            node.setGLProgramState(glProgram_state);
        }else{
            node.setShaderProgram(program);    
        }
        
    
        var children = node.children;
        if (!children)
            return;
    
        for (var i = 0; i < children.length; i++)
            this.setProgram(children[i], program);
    },
    onEnable: function () {
        this.node.on('touchstart', function (event) {
            event.stopPropagation();
        });
        this.node.on('touchend', function (event) {
            event.stopPropagation();
        });
    },


});