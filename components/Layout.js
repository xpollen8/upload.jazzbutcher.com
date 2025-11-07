import Image from 'next/image';
import Header from './Header'
import Footer from './Footer'

const Layout = ({ title, children }) => (
	<>
		<center>
			<Image src='/images/scandal_40.png' width={200} height={40} alt='logo' />
			<h2>File Uploader</h2>
		</center>
		<Header title={title} />
			{children}
		<Footer/>
	</>
)

export default Layout
