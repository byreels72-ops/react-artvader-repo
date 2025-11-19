import img1 from "@/assets//portfolio-1.jpg";
import img2 from "@/assets/portfolio-2.jpg";
import img3 from "@/assets/portfolio-3.jpg";
import img4 from "@/assets/portfolio-4.jpg";
import img5 from "@/assets/portfolio-5.jpg";
import img6 from "@/assets/portfolio-6.jpg";
import img8 from "@/assets/portfolio-8.jpg";
import img9 from "@/assets/portfolio-9.jpg";
import img7 from "@/assets/portfolio-10.jpg";


export const featuredData : {id : number , imgSrc : string ,imgAlt : string }[] = [
  {
    id: 1,
    imgSrc : img1,
    imgAlt : "Featured work 1"
  } ,
    {
    id: 2,
    imgSrc : img2,
    imgAlt : "Featured work 2"
  } ,  {
    id: 3,
    imgSrc : img3,
    imgAlt : "Featured work 3"
  } ,
  {
    id: 4,
    imgSrc : img4,
    imgAlt : "Featured work 4"
  } ,{
    id: 5,
    imgSrc : img5,
    imgAlt : "Featured work 5"
  } ,{
    id: 6,
    imgSrc : img6,
    imgAlt : "Featured work 6"
  } ,
   {
    id: 7,
    imgSrc : img7,
    imgAlt : "Featured work 7"
  } ,{
    id: 8,
    imgSrc : img8,
    imgAlt : "Featured work 8"
  } ,{
    id: 9,
    imgSrc : img9,
    imgAlt : "Featured work 9"
  } 
] 

export const portfolioItems : {id : number , imgSrc : string , category : string , title : string , story : string}[] = [
 
  {
    id: 1,
    title: "Chinar Leaves Mural",
    category: "Walls",
    // location: "Lal Chowk, Srinagar",
    story:
      "A vibrant celebration of Kashmir's iconic chinar tree, featuring bold autumn colors and traditional patterns.",
    imgSrc: img1,
  },
  {
    id: 2,
    title: "Mountain Heritage",
    category: "Street Murals",
    // location: "Dal Gate, Srinagar",
    story:
      "Depicting the majestic Himalayan ranges with cultural architecture, this mural honors Kashmir's natural beauty.",
    imgSrc: img2,
  },
  {
    id: 3,
    title: "Abstract Kashmir",
    category: "Canvas Art",
    // location: "Gallery Collection",
    story:
      "A modern interpretation of Kashmiri motifs through abstract graffiti art on canvas.",
    imgSrc: img3,
  },
  {
    id: 4,
    title: "Kastar Tribute",
    category: "Street Murals",
    // location: "Boulevard Road, Srinagar",
    story:
      "Bold lettering celebrating Kashmir's spirit with vibrant sunset colors and cultural symbols.",
    imgSrc: img4,
  },

  // NEW ITEMS
  {
    id: 5,
    title: "Shikara Nightscape",
    category: "Walls",
    // location: "Nigeen Lake, Srinagar",
    story:
      "A dreamy mural featuring illuminated shikaras drifting under a starry night sky inspired by Kashmiri folklore.",
    imgSrc: img5,
  },
  {
    id: 6,
    title: "Sufi Whirlwind",
    category: "Canvas Art",
    // location: "Studio Collection",
    story:
      "A spiritual abstract piece blending Sufi dance forms with graffiti splashes symbolizing divine movement.",
    imgSrc: img6,
  },
  {
    id: 7,
    title: "Wazwan Craft",
    category: "Street Murals",
    // location: "Rajbagh, Srinagar",
    story:
      "A bold mural showcasing traditional Kashmiri wazwan dishes fused with urban graffiti aesthetics.",
    imgSrc: img7,
  },
  {
    id: 8,
    title: "Shepherd's Melody",
    category: "Walls",
    // location: "Gulmarg Highway",
    story:
      "A peaceful composition illustrating Kashmiri shepherds, sheep, and mountain grasslands in soft hues.",
    imgSrc: img8,
  },
  {
    id: 9,
    title: "Lotus Reflection",
    category: "Canvas Art",
    // location: "Private Collection",
    story:
      "An elegant canvas featuring floating lotus flowers symbolizing purity, rendered in neon graffiti strokes.",
    imgSrc: img9,
  },

]
