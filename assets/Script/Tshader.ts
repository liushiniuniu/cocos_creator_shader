const { ccclass, property, requireComponent } = cc._decorator;

let vert = 
`
attribute vec4 a_position;  
attribute vec2 a_texCoord;  
attribute vec4 a_color;  
                      
varying vec4 v_fragmentColor;  
varying vec2 v_texCoord;  
                                  
void main()   
{                             
    gl_Position = CC_PMatrix * a_position;  
    v_fragmentColor = a_color;  
    v_texCoord = a_texCoord;  
} 
`;

let frag = 
`
varying vec4 v_fragmentColor;     
varying vec2 v_texCoord;      
          
void main()           
{  
    vec4 v_orColor = v_fragmentColor * texture2D(CC_Texture0, v_texCoord);  
    gl_FragColor = vec4(v_orColor); 
     
}  
`;


@ccclass
@requireComponent(cc.Sprite)
export default class Shader extends cc.Component {
    

    private glNode = null;
    private _native_vert_program  =  null;
    private _default_vert_program = null;
    private _black_white_frag = null;
    private _program = null;

    onLoad () {
        
        // 取到ccsg.Node对象，这里我使用在精灵上，所以节点上必须挂载“cc.Sprite”组件
        this.glNode = this.getComponent('cc.Sprite')._sgNode;

        this._loadShaderCode();
        this._onInitGLProgram();
    }
    
    /**
     * 读取渲染程序代码
     */
    private _loadShaderCode () {
        if (cc.sys.isNative) {
            this._native_vert_program = vert;
        } else {
            this._default_vert_program = vert;
        }
        this._black_white_frag = frag;
    }

    /**
     * 初始化GLProgram
     */
    private _onInitGLProgram () {
        this._program = new cc.GLProgram();

        if (cc.sys.isNative) {
            this._program.initWithString(this._native_vert_program, this._black_white_frag);
            this._program.link();
            this._program.updateUniforms();
        } else {
            this._program.initWithVertexShaderByteArray(this._default_vert_program, this._black_white_frag);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_POSITION, cc.macro.VERTEX_ATTRIB_POSITION);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_COLOR, cc.macro.VERTEX_ATTRIB_COLOR);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_TEX_COORD, cc.macro.VERTEX_ATTRIB_TEX_COORDS);
            this._program.link();
            this._program.updateUniforms();
        }
        this._setProgram(this.glNode, this._program);
    }

    /**
     * 设置GLProgram
     * @param {ccsg.Node} sgNode 
     * @param {cc.GLProgram} glProgram 
     */
    private _setProgram (sgNode, glProgram) {
        if (cc.sys.isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(glProgram);
            sgNode.setGLProgramState(glProgram_state);
        } else {
            sgNode.setShaderProgram(glProgram);    
        }
        
        var children = sgNode.children;
        if (!children) {
            return;
        }
    
        for (var i = 0; i < children.length; i++) {
            this._setProgram(children[i], glProgram);
        }
    }
}