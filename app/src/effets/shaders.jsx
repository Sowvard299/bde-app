// Point d'entrée unique des shaders Paper. Importé seulement à la demande
// (voir Trame.jsx et PhenixChrome.jsx) : la bibliothèque n'alourdit pas le
// premier chargement, et l'import nommé ne garde que ce qui sert.
import { ShaderMount } from '@paper-design/shaders-react'
import {
  getShaderColorFromString,
  liquidMetalFragmentShader,
  LiquidMetalShapes,
  ShaderFitOptions,
} from '@paper-design/shaders'
import phenixMetal from '../assets/phenix-metal.png'

export { Dithering } from '@paper-design/shaders-react'

// Le métal liquide de Paper prépare d'abord son image (un champ de
// distance calculé sur 512 px, 40 itérations) : près de deux secondes de
// calcul sur le fil principal, à chaque visite. On a fait ce calcul une
// fois pour toutes sur le phénix (assets/phenix-metal.png, réduit à
// 384 px) et on le donne directement au shader.
export function PhenixMetal({ teinte = '#ffffff', vitesse = 0.6, ...props }) {
  const uniforms = {
    u_colorBack: getShaderColorFromString('#00000000'),
    u_colorTint: getShaderColorFromString(teinte),
    u_image: phenixMetal,
    u_contour: 0.4,
    u_distortion: 0.07,
    u_softness: 0.1,
    u_repetition: 2,
    u_shiftRed: 0.3,
    u_shiftBlue: 0.3,
    u_angle: 70,
    u_isImage: true,
    u_shape: LiquidMetalShapes.none,
    u_fit: ShaderFitOptions.contain,
    u_scale: 1,
    u_rotation: 0,
    u_offsetX: 0,
    u_offsetY: 0,
    u_originX: 0.5,
    u_originY: 0.5,
    u_worldWidth: 0,
    u_worldHeight: 0,
  }

  return (
    <ShaderMount
      {...props}
      speed={vitesse}
      fragmentShader={liquidMetalFragmentShader}
      mipmaps={['u_image']}
      uniforms={uniforms}
    />
  )
}
