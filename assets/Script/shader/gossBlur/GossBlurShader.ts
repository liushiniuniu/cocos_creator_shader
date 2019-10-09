import Shader, { ShaderAttribute } from "../lib/Shader";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GossBlurShader extends Shader {
    vert: string = 'gossBlur_vsh';
    frag: string = 'gossBlur_fsh'

    attributes: ShaderAttribute[] = [
        {name: '', value: ''}
    ]
}