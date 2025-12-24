import React from "react";
import Card from "./Card";

const App = () => {
    const users = [
        {
            fullName: "Amit Sharma",
            bio: "Frontend developer learning React and Tailwind.",
            followCount: 1240,
            bookmarkCount: 320,
            image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
        },
        {
            fullName: "Priya Verma",
            bio: "UI designer who loves clean and minimal layouts.",
            followCount: 980,
            bookmarkCount: 410,
            image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
        },
        {
            fullName: "Rahul Singh",
            bio: "JavaScript learner building daily projects.",
            followCount: 860,
            bookmarkCount: 215,
            image: "https://images.unsplash.com/photo-1527980965255-d3b416303d12",
        },
        {
            fullName: "Sneha Gupta",
            bio: "Passionate about web design and animations.",
            followCount: 1430,
            bookmarkCount: 520,
            image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e",
        },
        {
            fullName: "Arjun Patel",
            bio: "Full stack aspirant focused on MERN.",
            followCount: 670,
            bookmarkCount: 190,
            image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d",
        },
        {
            fullName: "Neha Roy",
            bio: "Creative thinker and frontend enthusiast.",
            followCount: 1120,
            bookmarkCount: 430,
            image: "https://images.unsplash.com/photo-1517841905240-472988babdf9",
        },
        {
            fullName: "Rohit Das",
            bio: "Learning JavaScript fundamentals deeply.",
            followCount: 540,
            bookmarkCount: 120,
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
        },
        {
            fullName: "Kavita Mishra",
            bio: "CSS lover exploring responsive layouts.",
            followCount: 890,
            bookmarkCount: 260,
            image: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c",
        },
        {
            fullName: "Sourav Banerjee",
            bio: "React beginner sharing daily progress.",
            followCount: 760,
            bookmarkCount: 205,
            image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce",
        },
        {
            fullName: "Pooja Nair",
            bio: "Design focused frontend learner.",
            followCount: 1340,
            bookmarkCount: 480,
            image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1",
        },
        {
            fullName: "Vikas Yadav",
            bio: "Problem solver learning DSA with JS.",
            followCount: 620,
            bookmarkCount: 150,
            image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61",
        },
        {
            fullName: "Anjali Sen",
            bio: "Web dev student focused on consistency.",
            followCount: 910,
            bookmarkCount: 300,
            image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91",
        },
        {
            fullName: "Deepak Kumar",
            bio: "Building projects to master frontend.",
            followCount: 700,
            bookmarkCount: 180,
            image: "https://images.unsplash.com/photo-1528892952291-009c663ce843",
        },
        {
            fullName: "Riya Chatterjee",
            bio: "Minimal UI and smooth UX admirer.",
            followCount: 1580,
            bookmarkCount: 610,
            image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
        },
        {
            fullName: "Manish Pandey",
            bio: "Learning React components and props.",
            followCount: 830,
            bookmarkCount: 240,
            image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
        },
        {
            fullName: "Swati Joshi",
            bio: "Frontend learner exploring animations.",
            followCount: 990,
            bookmarkCount: 350,
            image: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df",
        },
        {
            fullName: "Nitin Malhotra",
            bio: "Focused on clean code and logic.",
            followCount: 560,
            bookmarkCount: 140,
            image: "https://images.unsplash.com/photo-1499996860823-5214fcc65f8f",
        },
        {
            fullName: "Ishita Paul",
            bio: "Design + code learner from India.",
            followCount: 1210,
            bookmarkCount: 470,
            image: "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7",
        },
        {
            fullName: "Karan Mehta",
            bio: "Building real-world JS projects.",
            followCount: 780,
            bookmarkCount: 210,
            image: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef",
        },
        {
            fullName: "Nandini Bose",
            bio: "Learning web dev step by step.",
            followCount: 1040,
            bookmarkCount: 390,
            image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e",
        },
    ];

    return (
        <div className="bg-slate-800 overflow-x-auto p-5 w-full h-screen gap-2 flex justify-center items-center flex-wrap">
            {users.map((user, index) => {
                return <Card key={index} user={user} />;
            })}
        </div>
    );
};

export default App;
