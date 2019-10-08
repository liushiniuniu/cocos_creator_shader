module.exports = 
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

`
#define repeats 5.
uniform sampler2D texture;
uniform vec4 color;
uniform float num;
varying vec2 uv0;

vec4 draw(vec2 uv) {
    return color * texture2D(texture,uv).rgba; 
}
float grid(float var, float size) {
    return floor(var*size)/size;
}
float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}
void main()
{
    vec4 blurred_image = vec4(0.);
    for (float i = 0.; i < repeats; i++) { 
        vec2 q = vec2(cos(degrees((i/repeats)*360.)),sin(degrees((i/repeats)*360.))) * (rand(vec2(i,uv0.x+uv0.y))+num); 
        vec2 uv2 = uv0+(q*num);
        blurred_image += draw(uv2)/2.;
        q = vec2(cos(degrees((i/repeats)*360.)),sin(degrees((i/repeats)*360.))) * (rand(vec2(i+2.,uv0.x+uv0.y+24.))+num); 
        uv2 = uv0+(q*num);
        blurred_image += draw(uv2)/2.;
    }
    blurred_image /= repeats;
    gl_FragColor = vec4(blurred_image);
}
`