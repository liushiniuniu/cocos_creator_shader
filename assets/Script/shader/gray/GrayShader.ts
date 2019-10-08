import Shader from "../Shader";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GrayShader extends Shader {
    vert: string = 'gray_vsh';
    frag: string = 'gray_fsh'

}
