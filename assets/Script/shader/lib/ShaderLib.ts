
export enum ShaderName {
    gray =  'gray',
    pure_color = 'pure_color',
    blur = 'blur',
    circle_cut = 'circle_cut'
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

            uniform vec3 FRAG_SET_COLOR;
            uniform float COLOR_OPACITY;


            void main()           
            {  
                vec4 color = texture2D(CC_Texture0, v_texCoord);
                // vec4 targetColor  =  vec4(0.0, 1.0, 0.0, 1.0);
                vec4 targetColor  =  vec4(FRAG_SET_COLOR[0], FRAG_SET_COLOR[1], FRAG_SET_COLOR[2], COLOR_OPACITY);
                gl_FragColor = color * targetColor;
            }  
            `
        },

        {
            name: ShaderName.circle_cut,
            desc_zh: '将图片切成圆角',
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
                    float u_edge = 0.1;
                    float edge = u_edge;
                    vec4 color = texture2D(CC_Texture0, v_texCoord);
                    vec2 uv = v_texCoord - vec2(0.5, 0.5);
                    float rx = abs(uv.x) - (0.5 - edge);   // 圆的半径
                    float ry = abs(uv.y) - (0.5 - edge);
                    float mx = step(0.5 - edge, abs(uv.x));   //  取坐标， 0.5 ？ 0.4？
                    float my = step(0.5 - edge, abs(uv.y));     // step(a,x)   如果 x<a，返回 0；否则，返回 1。
                    float r = length(vec2(rx, ry));  // 算向量长度

                    float a = 1.0 - mx * my  * step(edge, r);
                    gl_FragColor = vec4(color.rgb, color.a * a);


                    // if (r < edge) {
                    //     gl_FragColor = color;
                    // } else  {
                    //     float progress = 1.0 - (r - edge);  
                    //     float opacity = smoothstep(1.0, 0.0, progress);
                    //     gl_FragColor = vec4(color.rgb, color.a * opacity);
                    //     // gl_FragColor = vec4(color.rgb,  opacity);
                    // }
                    
                }
            `
        }

    ];
}