import Shader from "./lib/Shader";
import { ShaderName } from "./lib/ShaderLib";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GrayShader extends Shader {


    click() {
        this.init(ShaderName.gray);
    }
}
