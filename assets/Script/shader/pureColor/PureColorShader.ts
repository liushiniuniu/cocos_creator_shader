import Shader from "../Shader";

const { ccclass, property} = cc._decorator;


interface ShaderColor {
    red: number,
    green: number,
    blue: number,
    opacity: number,
}


@ccclass
export default class PureColorShader extends Shader {
    vert: string = 'pureColor_vsh';
    frag: string = 'pureColor_fsh';
}