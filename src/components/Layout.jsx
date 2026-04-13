import Sidebar from "./Sidebar";

function Layout({ children }) {
    return (
        <div style={{ display: "flex" ,}}>
            <Sidebar />
            <div style={{ marginLeft: "220px", width: "100%", padding: "20px" }}>
                {children}
            </div>
        </div>
    );
}

export default Layout;