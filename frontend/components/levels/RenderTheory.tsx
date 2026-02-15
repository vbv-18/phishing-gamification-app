import React from "react";
import IconTheory from "./IconTheory"
import CardTheory from "./CardTheory"
import ComparisonTheory from "./ComparisonTheory"
import SignalTheory from "./SignalTheory";

//tipar slides
// hacer home

export default function Renderer({slide}: {slide: any}){
    switch(slide.type){
        case 'icons':
            return <IconTheory slide={slide} />;

        case 'cards':
            return <CardTheory slide={slide} />;

        case 'comparison':
            return <ComparisonTheory slide={slide} />;
            
        case 'signal':
            return <SignalTheory slide={slide} />
        
        default:
            return null;
    }
}