// module.exports = 
// `
// varying vec4 v_fragmentColor;     
// varying vec2 v_texCoord;      
          
// void main()           
// {  
//     vec4 v_orColor = v_fragmentColor * texture2D(CC_Texture0, v_texCoord);  
//     float gray = dot(v_orColor.rgb, vec3(0.299, 0.587, 0.114));  
//     gl_FragColor = vec4(gray, gray, gray, v_orColor.a); 


// }  
// `;


// module.exports = 
// 'varying vec4 v_fragmentColor; ' +     
// 'varying vec2 v_texCoord;      ' +
          
// 'void main()  ' +           
// '{   ' +      
// '    vec4 v_orColor =  texture2D(CC_Texture0, v_texCoord);   ' +      
// '    vec2 uv = v_texCoord - vec2(0.5,0.5);//移动UV坐标中心     ' +      
// '    float rx = fmod(uv.x, 0.4);//圆角所在区域，也就是圆角半径为0.1  ' +      
// '    float ry = fmod(uv.y, 0.4);//  ' +      
// '    float mx = step(0.4, abs(uv.x));//大于0.4的部分， step(a，x):x<a取0，否则返回1   ' +      
// ' 　 float my = step(0.4, abs(uv.y));//    ' +      
// '　　float alpha = 1 - mx*my*step(0.1, length(half2(rx,ry)));//在[0,0.4]范围，mx*my始终为0，最终值始终为1；在（0.4,0.5]范围，所在的圆角区域，mx*my使用为1，大小由圆角半径决定；在剩下的其他区域，mx*my也是为0，最终值为；  ' +      
// '    gl_FragColor = vec4(v_orColor, alpha);   ' +      
// '}'      
// ;



module.exports = 
`
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

`;
