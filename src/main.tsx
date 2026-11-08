import { Analytics } from "@vercel/analytics/next";
import { mount } from './mount';
import { Home } from './pages/Home';

mount(<><Home /><Analytics /></>);