import crypto from 'crypto';
import Document, { Html, Head, Main, NextScript } from 'next/document'

const cspHashOf = (text) => {
  const hash = crypto.createHash('sha256')
  hash.update(text)
  return `'sha256-${hash.digest('base64')}'`
}

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
		let csp = `style-src 'self' 'unsafe-inline'; img-src blob: data: https://upload.jazzbutcher.com https://s3.amazonaws.com/upload.jazzbutcher.com 'self'; frame-src 'unsafe-inline'; font-src 'self' data: ; connect-src https://s3.amazonaws.com/upload.jazzbutcher.com 'self'; default-src 'self'; script-src 'unsafe-eval' 'self' ${cspHashOf(NextScript.getInlineScriptSource(this.props))}`

    return (
      <Html lang="en">
				<Head>
				  <meta httpEquiv="Content-Security-Policy" content={csp} />
				</Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
