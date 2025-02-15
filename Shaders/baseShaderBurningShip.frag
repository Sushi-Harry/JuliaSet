#version 330

in vec4 gl_FragCoord;
out vec4 FinalColor;

uniform vec2 resolution;
uniform float zoomFactor;
uniform float time;
uniform vec2 offset;
uniform vec2 complexNum;

#define MAX_ITERATIONS 1000
 
int get_iterations()
{
    float real = (gl_FragCoord.x / resolution.x - 0.5) * zoomFactor + offset.x;
    float imag = (gl_FragCoord.y / resolution.y - 0.5) * zoomFactor + offset.y;
 
    int iterations = 0;
    float const_real = real;
    float const_imag = imag;
    
    //The difference between Julia Set and Mandelbrot Set is that instead of choosing a constant real and imaginary part from the location of a pixel on the screen, I'm instead taking in a vector "C" and passing it's x and y components as real and imaginary constant parts.
    while (iterations < MAX_ITERATIONS)
    {
        float tmp_real = real;
        real = (abs(real) * abs(real) - abs(imag) * abs(imag)) + const_real;
        imag = -abs(2.0 * (tmp_real) * (imag)) + const_imag;
        
        float dist = real * real + imag * imag;

        //escape condition
        if (dist > 4.0)
            break;
 
        ++iterations;
    }
    return iterations;
}

vec4 return_color(){
    int iter = get_iterations();
    if(iter == MAX_ITERATIONS){
        return vec4(0.0f, 0.0f, 0.0f, 1.0f);
    }

    float iterations = float(iter) / MAX_ITERATIONS;
    // return vec4(0.7f, sin(iterations * time), 0.1f, 1.0f);2
    return vec4(0.7f, iterations * (sin(time) + 2) * 10, 0.1f, 1.0f);
}

void main(){
    FinalColor = return_color();
}