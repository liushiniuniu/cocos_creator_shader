
export enum ShaderName {
    gray =  'gray',
    pure_color = 'pure_color',
    blur = 'blur',
}

export interface  ShaderCode {
    name: ShaderName,
    desc_zh: string,
    vert_code: string,
    frag_code: string
} 

export default class ShaderLib {
    static shaders: ShaderCode[] = [
        {
            name: ShaderName.gray,
            desc_zh: '该shader 使绑定图片置灰',
            vert_code: `
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
                } 
            `,
            frag_code: `
                varying vec4 v_fragmentColor;     
                varying vec2 v_texCoord;      
                        
                void main()           
                {  
                    vec4 v_orColor = v_fragmentColor * texture2D(CC_Texture0, v_texCoord);  
                    float gray = dot(v_orColor.rgb, vec3(0.299, 0.587, 0.114));  
                    gl_FragColor = vec4(gray, gray, gray, v_orColor.a);  
                }
            `
        },


        {
            name: ShaderName.pure_color,
            desc_zh: '该shader 叠加指定的颜色绑定图片上',
            vert_code: `
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
                } 
            `,

            frag_code: ` 
                #ifdef GL_ES
                precision mediump float;
                #endif

                varying vec4 v_fragmentColor;
                varying vec2 v_texCoord;

                void main()           
                {  
                    vec4 color = texture2D(CC_Texture0, v_texCoord);
                    vec4 targetColor  =  vec4(0.0, 1.0, 0.0, 1.0);
                    gl_FragColor = color * targetColor;
                } 
            `
        }

    ];
}