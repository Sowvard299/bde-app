import { Component } from 'react'

// Garde-fou des effets visuels : si leur code ne se charge pas (réseau
// coupé, version du site changée entre-temps) ou plante, on affiche
// `repli` à leur place au lieu de laisser l'erreur vider toute la page.
export default class RepliSurErreur extends Component {
  state = { erreur: false }

  static getDerivedStateFromError() {
    return { erreur: true }
  }

  render() {
    return this.state.erreur ? (this.props.repli ?? null) : this.props.children
  }
}
