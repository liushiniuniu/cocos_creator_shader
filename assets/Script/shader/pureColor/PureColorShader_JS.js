
cc.Class({    
    extends: cc.Component,

    ctor() {
        this.attributes =  [];
    
        this.glNode = null;
        this._native_vert_program  =  null;
        this. _default_vert_program = null;
        this._black_white_frag = null;
        this. _program = null;
    
    
        this.testColor = [0.0, 1.0, 0.0, 1.0];
        this.vert = `
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
            }`;
    
        this.frag =  `
            #ifdef GL_ES
            precision mediump float;
            #endif

            varying vec4 v_fragmentColor;
            varying vec2 v_texCoord;

            uniform vec3 FRAG_SET_COLOR;
            uniform float COLOR_OPACITY;


            void main()           
            {  
                vec4 color = texture2D(CC_Texture0, v_texCoord);
                // vec4 targetColor  =  vec4(0.0, 1.0, 0.0, 1.0);
                vec4 targetColor  =  vec4(FRAG_SET_COLOR[0], FRAG_SET_COLOR[1], FRAG_SET_COLOR[2], COLOR_OPACITY);
                gl_FragColor = color * targetColor;
            }  
            `;

    },

    properties: {

    },

    /**
     * 设置颜色， 需要传入制定数据结构的颜色，进行叠加，
     * @param {*} color 
     * @example this.setColor({red: 0.0, green: 1.0, blue: 0.0, opacity: 1.0});
     */
    setColor(color) {
        let isColorUsable = this._colorCheck(color);
        if (!isColorUsable) {
            return;
        }

        this.testColor = [color.red, color.green, color.blue, color.opacity];
        
        if (cc.sys.isNative) {
            if (this.frag === null || this.vert === null) {
                return;
            }
        } 
        
        // 取到ccsg.Node对象，这里我使用在精灵上，所以节点上必须挂载“cc.Sprite”组件
        this.glNode = this.getComponent('cc.Sprite')._sgNode;
    
        this._loadShaderCode();
        this._onInitGLProgram();
    },


    
    /**
     * 读取渲染程序代码
     */
     _loadShaderCode () {
        if (cc.sys.isNative) {
            this._native_vert_program = this.vert;
        } else {
            this._default_vert_program = this.vert;
        }
        this._black_white_frag = this.frag;
    },


    /**
     * 初始化GLProgram
     */
     _onInitGLProgram () {
        this._program = new cc.GLProgram();
        
        if (cc.sys.isNative) {
            this._program.initWithString(this._native_vert_program, this._black_white_frag);
        } else {
            this._program.initWithVertexShaderByteArray(this._default_vert_program, this._black_white_frag);
            this.attributes.push({name: cc.macro.ATTRIBUTE_NAME_COLOR, value: cc.macro.VERTEX_ATTRIB_COLOR})
            this.attributes.push({name: cc.macro.ATTRIBUTE_NAME_POSITION, value: cc.macro.VERTEX_ATTRIB_POSITION})
            this.attributes.push({name: cc.macro.ATTRIBUTE_NAME_TEX_COORD, value: cc.macro.VERTEX_ATTRIB_TEX_COORDS})
        }

        this._addAtrribute(this._program, this.attributes);

        
        this._program.link();
        this._program.updateUniforms();
        this._setProgram(this.glNode, this._program);
    },

    /**
     * 设置GLProgram
     * @param {ccsg.Node} sgNode 
     * @param {cc.GLProgram} glProgram 
     */
     _setProgram (sgNode, glProgram) {
        if (cc.sys.isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(glProgram);
            glProgram_state.setUniformVec3( "FRAG_SET_COLOR", {x: this.testColor[0], y: this.testColor[1], z: this.testColor[2]});
            glProgram_state.setUniformFloat( "COLOR_OPACITY", this.testColor[3]);
            sgNode.setGLProgramState(glProgram_state);
        } else {
            let res = glProgram.getUniformLocationForName( "FRAG_SET_COLOR" );
            glProgram.setUniformLocationWith3f( res, this.testColor[0], this.testColor[1], this.testColor[2]);
            let res_opacity = glProgram.getUniformLocationForName( "COLOR_OPACITY" );
            glProgram.setUniformLocationWith1f(res_opacity, this.testColor[3]);

            sgNode.setShaderProgram(glProgram);    
        }

        var children = sgNode.children;
        if (!children) {
            return;
        }
    
        for (var i = 0; i < children.length; i++) {
            this._setProgram(children[i], glProgram);
        }
    },

     _addAtrribute(program, attributes) {
        attributes.forEach(att => {
            program.addAttribute(att.name, att.value);
        })

        return program;
    },

    /**
     * 颜色检查
     * @param color 
     */
     _colorCheck(color) {
        for (let i in color) {
            if (color[i] > 1 || color[i] < 0 || !this._isFloat(color[i])) {
                cc.error('颜色值区间必须为 0.0 -1.0， 必须为小数')
                return false;
            }
        }
        return true;
    },

    /**
     * 检查是否是小数
     * @param num 
     */
     _isFloat(num) {
        let numStr = num + '';
        return numStr.split('.').length == 1;
    }
})