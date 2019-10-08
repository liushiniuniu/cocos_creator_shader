module.exports = 
// `
// attribute vec4 a_position;  
// attribute vec2 a_texCoord;  
// attribute vec4 a_color;  
                      
// varying vec4 v_fragmentColor;  
// varying vec2 v_texCoord;  
                                  
// void main()   
// {                             
//     gl_Position = CC_PMatrix * a_position;  
//     v_fragmentColor = a_color;  
//     v_texCoord = a_texCoord;  
// } 
// `;
`
attribute vec3 a_position;
attribute vec2 a_uv0;

uniform mat4 viewProj;
uniform mat4 model;


varying vec2 uv0;

void main () {
    mat4 mvp;
    mvp = viewProj * model;
    vec4 pos = mvp * vec4(a_position, 1);
    gl_Position = pos;
    uv0 = a_uv0;
}
`;