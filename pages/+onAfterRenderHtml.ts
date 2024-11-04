import { useConfig } from 'vike-react/useConfig' // or vike-vue / vike-solid

 
export function onAfterRenderHtml(pageContext: any) {
    // The +Page.vue component rendered to the HTML string
    //pageContext.pageHtmlString
    // The +Page.vue component rendered to an HTML stream
    //pageContext.pageHtmlStream
    console.log('render 111')
   }