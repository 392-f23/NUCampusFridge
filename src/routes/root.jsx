import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import "./root.css";
import { useLocation } from 'react-router-dom';
import Banner from "../components/Banner";
import { getDbData } from "../utilities/firebase";

const Root = () => {
    const [data, setData] = useState(null);
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    useEffect(() => {
        getDbData("/Data").then((fetchedData) => {
            setData(fetchedData);
            console.log(fetchedData)
        }).catch((error) => {
            console.log(error);
        });
    }, []);

    return (
        <div className="App min-h-screen flex flex-col">
            <div className="flex-grow">
                {data ? (
                    <Outlet context={{ items: data }} />
                ) : (
                    <div className="text-center mt-8">
                        <p className="text-lg font-bold text-white">Loading...Paws for a moment</p>
                    </div>
                )}
            </div>
            {pathname !== '/map' && pathname !== '/login' &&
                <footer className="w-full p-8">
                    <p className="text-center text-default-500 text-sm">Northwestern University</p>
                    <p className="text-center text-default-500 text-sm">© {new Date().getFullYear()} Northwestern Campus Fridge</p>
                </footer>
            }
        </div>
    );
};

export default Root;
