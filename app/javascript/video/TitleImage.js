import TitleImage from '../images/brandIllustrationsOnboardingConversations@3x.png'

export default function({ title }) {
  return `
  <div>
    <p>${title}</p>
    <p><img src=${TitleImage} alt="Title" /></p>
  </div>
  `
}