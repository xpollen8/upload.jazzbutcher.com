import Header from './Header'
import Footer from './Footer'

const Layout = ({ title, children }) => (
	<>
	<Header title={title} />
		{children}
	<Footer/>
	</>
)

export default Layout
