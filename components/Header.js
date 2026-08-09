import Head from 'next/head';
import Link from 'next/link'

import { Image, Navbar, Nav, NavDropdown, Form, FormControl, Button } from 'react-bootstrap';

const Header = ({ title = 'Welcome!' }) => {
	return (
		<>
		<Head>
			<meta name="description" content={title} />
			<title>Jazz Butcher - {title}</title>
		</Head>
		<div className="navbar navbar-fixed-top cbp-af-header-shrink">
		</div>
		</>
	)
};

export default Header;
