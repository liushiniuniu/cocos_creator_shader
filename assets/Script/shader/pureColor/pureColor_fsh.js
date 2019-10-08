module.exports = 
`

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
`;