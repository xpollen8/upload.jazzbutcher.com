import Header from './Header'
import Footer from './Footer'

const Layout = ({ title, children }) => (
	<>
	<h1 style={{ textAlign: 'center' }}>Jazz Butcher file uploader</h1>
	<Header title={title} />
		{children}
	<Footer/>
	</>
)

export default Layout
