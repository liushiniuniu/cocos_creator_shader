import Shader from "./lib/Shader";
import { ShaderName } from "./lib/ShaderLib";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CircleCutShader extends Shader {

    click() {
        this.init(ShaderName.circle_cut)
    }

}