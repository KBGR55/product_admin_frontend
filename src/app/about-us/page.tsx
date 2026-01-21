'use client';

import Features from "../components/Features";
import Header from "../components/Header";


export default function AboutUsPage() {
    return (
        <div className="">
            <Header cartCount={0} onCartClick={() => { }} showCart={false} />
            <Features />
        </div>
    );
}