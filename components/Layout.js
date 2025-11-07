import Image from 'next/image';
import Header from './Header'
import Footer from './Footer'

const Layout = ({ title, children }) => (
	<>
		<center>
			<p/>
			<Image src='/images/scandal_40.png' width={200} height={40} alt='logo' />
			<p/>
			<b>File Uploader</b>
		</center>
		<Header title={title} />
			{children}
		<Footer/>
	</>
)

export default Layout
