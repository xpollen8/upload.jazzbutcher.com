import Header from './Header'
import Footer from './Footer'

const Layout = ({ title, children }) => (
	<>
		<h1>Jazz Butcher File Uploader</h1>
		<Header title={title} />
			{children}
		<Footer/>
	</>
)

export default Layout
