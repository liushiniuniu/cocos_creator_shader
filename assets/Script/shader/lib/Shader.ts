import ShaderLib, { ShaderName } from "./ShaderLib";

const { ccclass, property, requireComponent } = cc._decorator;

export interface ShaderAttribute {
    name: any,
    value: any
}

/**
 * shader父类， 要设置自定义的uniform 或者attribute ，要重写 setCustomVars 方法，可自动调用， 调用init方法使shader 生效
 */
@ccclass
@requireComponent(cc.Sprite)
export default class Shader extends cc.Component {
    

    attributes: ShaderAttribute[] = [];

    private glNode = null;
    private _default_vert_program = null;
    private _black_white_frag = null;
    private _program: cc.GLProgram = null;

    addAtrributeCb: Function = null;

    
    init(shaderName: ShaderName) {
        
        // 取到ccsg.Node对象，这里我使用在精灵上，所以节点上必须挂载“cc.Sprite”组件
        this.glNode = this.getComponent('cc.Sprite')._sgNode;
    
        this._loadShaderCode(shaderName);
        this._onInitGLProgram();
    }
    
    /**
     * 留给子类进行重写的方法
     * @param sgNode 
     * @param GLProgram 
     * @param isNative 
     */
    public setCustomVars(sgNode, glProgram, isNative: boolean) {

    }

    /**
     * 读取渲染程序代码
     */
    private _loadShaderCode (shaderName: ShaderName) {
        for (let i = 0; i<ShaderLib.shaders.length; i++) {
            if (ShaderLib.shaders[i].name == shaderName) {
                this._default_vert_program = ShaderLib.shaders[i].vert_code;
                this._black_white_frag = ShaderLib.shaders[i].frag_code;
                return;
            }
        }
        if (!this._default_vert_program) {
            cc.error('没有找到指定的shader代码')
        }
    }


    /**
     * 初始化GLProgram
     */
    private _onInitGLProgram () {
        this._program = new cc.GLProgram();
        
        if (cc.sys.isNative) {
            this._program.initWithString(this._default_vert_program, this._black_white_frag);
        } else {
            this._program.initWithVertexShaderByteArray(this._default_vert_program, this._black_white_frag);
            this.attributes.push({name: cc.macro.ATTRIBUTE_NAME_COLOR, value: cc.macro.VERTEX_ATTRIB_COLOR})
            this.attributes.push({name: cc.macro.ATTRIBUTE_NAME_POSITION, value: cc.macro.VERTEX_ATTRIB_POSITION})
            this.attributes.push({name: cc.macro.ATTRIBUTE_NAME_TEX_COORD, value: cc.macro.VERTEX_ATTRIB_TEX_COORDS})
        }

        this._addAtrribute(this._program, this.attributes);

        if (this.addAtrributeCb) {
            this.addAtrributeCb(this._program);
        }
        
        this._program.link();
        this._program.updateUniforms();
        this._setProgram(this.glNode, this._program);
    }

    /**
     * 设置GLProgram
     * @param {ccsg.Node} sgNode 
     * @param {cc.GLProgram} glProgram 
     */
    private _setProgram (sgNode, glProgram) {
        this.setCustomVars(sgNode, glProgram, cc.sys.isNative);
        if (cc.sys.isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(glProgram);
            this.setCustomVars(sgNode, glProgram, true);
            sgNode.setGLProgramState(glProgram_state);
        } else {
            this.setCustomVars(sgNode, glProgram, false);
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

    private _addAtrribute(program: cc.GLProgram, attributes: ShaderAttribute[]) {
        attributes.forEach(att => {
            program.addAttribute(att.name, att.value);
        })

        return program;
    }

 
}