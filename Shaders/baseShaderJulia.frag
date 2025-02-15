#version 330

in vec4 gl_FragCoord;
out vec4 FinalColor;

uniform vec2 resolution;
uniform float zoomFactor;
uniform float time;
uniform vec2 offset;
uniform vec2 complexNum;

#define MAX_ITERATIONS 500
 
int get_iterations()
{
    float real = (gl_FragCoord.x / resolution.x - 0.7) * zoomFactor + offset.x;
    float imag = (gl_FragCoord.y / resolution.y - 0.9) * zoomFactor + offset.y;
 
    int iterations = 0;
    float const_real = real;
    float const_imag = imag;
    
    //The difference between Julia Set and Mandelbrot Set is that instead of choosing a constant real and imaginary part from the location of a pixel on the screen, I'm instead taking in a vector "C" and passing it's x and y components as real and imaginary constant parts.
    while (iterations < MAX_ITERATIONS)
    {
        float tmp_real = real;
        real = (real * real - imag * imag) + complexNum.x;
        imag = (2.0 * tmp_real * imag) + complexNum.y;
         
        float dist = real * real + imag * imag;
         
        if (dist > 4.0)
        break;
 
        ++iterations;
    }
    return iterations;
}

vec4 return_color(){
    int iter = get_iterations();
    if(iter == MAX_ITERATIONS){
        gl_FragDepth = 0.0f;
        return vec4(0.0f, 0.0f, 0.0f, 1.0f);
    }

    float iterations = float(iter) / MAX_ITERATIONS;
    return vec4(0.2f, sin(iterations * time), 0.5f, 1.0f);
}

void main(){
    FinalColor = return_color();
}