
cc.Class({
    extends: cc.Component,

    properties: {

    },
    
    
    // 初始化
    onLoad() {
        this._initParam();
        cc.director.setDisplayStats(true);
        this.resolution.x = (this.node.getContentSize().width );
        this.resolution.y = (this.node.getContentSize().height);
        let self = this;
        self._useShader();
        
        this.node.on(cc.Node.EventType.TOUCH_START, this._onTouchStart, this);
    },
    
    _initParam: function() {
        
        this.default_vert = `
        attribute vec4 a_position;
        attribute vec2 a_texCoord;
        attribute vec4 a_color;
        varying vec2 v_texCoord;
        varying vec4 v_fragmentColor;
        void main()
        {
            gl_Position = CC_PMatrix * a_position;
            v_fragmentColor = a_color;
            v_texCoord = a_texCoord;
        }
        `;
        
        this.frag_glsl =  `
        #ifdef GL_ES
        precision mediump float;
        #endif
        
        uniform vec2 startPos;
        uniform float curdis;
        uniform float time;
        uniform vec2 resolution;
        varying vec2 v_texCoord;
        
        void main()
        {
            vec2 dv = startPos - v_texCoord;
            dv = dv * vec2(resolution.x/resolution.y, 1.0);  
            float dis = sqrt(dv.x * dv.x + dv.y * dv.y);
            float disF = clamp(0.05 - abs(curdis - dis), 0.0, 0.2);
            float strength = 1.0;
            if (dis > 0.1) {
                strength = smoothstep(0.16, 0.0, dis);
            }
            vec2 offset = normalize(dv) * sin(dis * 200.0 + time * 0.05) * 0.2 * disF * strength;
            vec2 uv = v_texCoord + offset;
            gl_FragColor = texture2D(CC_Texture0, uv);
        }
        `;
        this.program = null;
        this.startTime = Date.now();
        this.time = 0;
        this.resolution = { x:0.0, y:0.0};
        this.curdis = 6;
        this.isPlayAni = false;
        this.startPos = { x:0.5, y:0.5};
    },
    
    _useShader() {
        this.program = new cc.GLProgram(); 
        if (cc.sys.isNative) {
            this.program.initWithString(this.default_vert, this.frag_glsl);
        } else {
            this.program.initWithVertexShaderByteArray(this.default_vert, this.frag_glsl);
            this.program.addAttribute(cc.macro.ATTRIBUTE_NAME_POSITION, cc.macro.VERTEX_ATTRIB_POSITION);
            this.program.addAttribute(cc.macro.ATTRIBUTE_NAME_COLOR, cc.macro.VERTEX_ATTRIB_COLOR);
            this.program.addAttribute(cc.macro.ATTRIBUTE_NAME_TEX_COORD, cc.macro.VERTEX_ATTRIB_TEX_COORDS);
        }
        this.program.link();
        this.program.updateUniforms();
        this.program.use();
    
        if (cc.sys.isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this.program);
            glProgram_state.setUniformFloat("time", this.time);
            glProgram_state.setUniformFloat("curdis", this.curdis);
            glProgram_state.setUniformVec2( "resolution", this.resolution );
        } else {
            let ba = this.program.getUniformLocationForName("time");
            let res = this.program.getUniformLocationForName( "resolution" );
            this.program.setUniformLocationWith1f(ba, this.time);
            this.program.setUniformLocationWith2f( res, this.resolution.x,this.resolution.y );
    
            this.program.setUniformLocationWith1f(this.program.getUniformLocationForName("curdis"), this.curdis);
        }
        this._setProgram(this.node.getComponent(cc.Sprite)._sgNode, this.program);
    },
    
    _setProgram(node, program) {
        if (cc.sys.isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(program);
            node.setGLProgramState(glProgram_state);
        } else {
            node.setShaderProgram(program);
        }
    },
    
    _updateParameters() {
        this.time = (Date.now() - this.startTime) / 1000;
        const speedItem = 0.3;
        this.curdis = this.time * speedItem;
        if (this.curdis > 2) {
            this.isPlayAni = false;
        }
    },
    // 每帧更新函数
    update(dt) {
        if (!this.isPlayAni) {
            return;
        }
    
        this._updateParameters();
        if (this.program) {
            this.program.use();
            if (cc.sys.isNative) {
                var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this.program);
                glProgram_state.setUniformFloat("time", this.time);
                glProgram_state.setUniformFloat("curdis", this.curdis);
                glProgram_state.setUniformVec2( "startPos", this.startPos);
            } else {
                let ct = this.program.getUniformLocationForName("time");
                this.program.setUniformLocationWith1f(ct, this.time);
                this.program.setUniformLocationWith1f(this.program.getUniformLocationForName("curdis"), this.curdis);
                this.program.setUniformLocationWith2f(this.program.getUniformLocationForName("startPos"), this.startPos.x, this.startPos.y);
            }
        }
    },
    
    _onTouchStart (event) {
        this.startTime = Date.now();
        this.isPlayAni = true;
    
        let touchPos = event.getLocation();
        touchPos = this.node.convertToNodeSpace(touchPos);
        this.startPos.x = touchPos.x /this.node.width;
        this.startPos.y = (this.node.height-touchPos.y) / this.node.height;
    },
})

