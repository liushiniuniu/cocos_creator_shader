import Shader, { ShaderAttribute } from "../Shader";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CircleCutShader extends Shader {
    vert: string = 'CircleCut_vsh';
    frag: string = 'CircleCut_fsh'

    // attributes: ShaderAttribute[] = [
    //     {name: '', value: ''}
    // ]
}