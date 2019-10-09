import Shader from "./lib/Shader";
import { ShaderName } from "./lib/ShaderLib";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PureColorShader extends Shader {

    @property(cc.Float)
    red: number = 1.0;

    @property(cc.Float)
    green: number = 0.0;

    @property(cc.Float)
    blue: number = 0.0;

    @property(cc.Float)
    opacity: number = 1.0;

    click() {
        this.init(ShaderName.pure_color);
    }
    
    public setCustomVars(sgNode, glProgram, isNative: boolean) {

        if (isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(glProgram);
            glProgram_state.setUniformVec3( "FRAG_SET_COLOR", {x: this.red, y: this.green, z: this.blue});
            glProgram_state.setUniformFloat( "COLOR_OPACITY", this.opacity);
        } else {
            let res = glProgram.getUniformLocationForName( "FRAG_SET_COLOR" );
            glProgram.setUniformLocationWith3f( res, this.red, this.green, this.blue);
            let res_opacity = glProgram.getUniformLocationForName( "COLOR_OPACITY" );
            glProgram.setUniformLocationWith1f(res_opacity, this.opacity);
        }

    }
}