import React from "react";
import Card from "./components/Card";

const App = () => {
    const users = [
        {
            fullName: "Amit Sharma",
            coverImage:
                "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
            profilePhoto:
                "https://images.unsplash.com/photo-1603415526960-f7e0328c63b1",
            bio: "Frontend developer and tech enthusiast from Delhi.",
            likeCount: 1240,
            postCount: 86,
            viewCount: 45210,
        },
        {
            fullName: "Priya Verma",
            coverImage:
                "https://images.unsplash.com/photo-1503264116251-35a269479413",
            profilePhoto:
                "https://images.unsplash.com/photo-1607746882042-944635dfe10e",
            bio: "UI designer who loves clean and minimal designs.",
            likeCount: 980,
            postCount: 64,
            viewCount: 38900,
        },
        {
            fullName: "Rahul Singh",
            coverImage:
                "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d",
            profilePhoto:
                "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d",
            bio: "JavaScript learner building projects every day.",
            likeCount: 1560,
            postCount: 102,
            viewCount: 61230,
        },
        {
            fullName: "Neha Gupta",
            coverImage:
                "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429",
            profilePhoto:
                "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
            bio: "Content creator and lifestyle blogger.",
            likeCount: 2210,
            postCount: 140,
            viewCount: 80540,
        },
        {
            fullName: "Sourav Das",
            coverImage:
                "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
            profilePhoto:
                "https://images.unsplash.com/photo-1527980965255-d3b416303d12",
            bio: "Full stack developer from West Bengal.",
            likeCount: 870,
            postCount: 58,
            viewCount: 30120,
        },
        {
            fullName: "Anjali Roy",
            coverImage:
                "https://images.unsplash.com/photo-1470770841072-f978cf4d019e",
            profilePhoto:
                "https://images.unsplash.com/photo-1524504388940-b1c1722653e1",
            bio: "Photography lover and travel explorer.",
            likeCount: 1980,
            postCount: 112,
            viewCount: 73450,
        },
        {
            fullName: "Vikas Mishra",
            coverImage:
                "https://images.unsplash.com/photo-1500534623283-312aade485b7",
            profilePhoto:
                "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61",
            bio: "Backend developer focused on Node and APIs.",
            likeCount: 640,
            postCount: 41,
            viewCount: 22980,
        },
        {
            fullName: "Pooja Nair",
            coverImage:
                "https://images.unsplash.com/photo-1502082553048-f009c37129b9",
            profilePhoto:
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
            bio: "Digital marketer and brand strategist.",
            likeCount: 1340,
            postCount: 77,
            viewCount: 49860,
        },
        {
            fullName: "Karan Patel",
            coverImage:
                "https://images.unsplash.com/photo-1491553895911-0055eca6402d",
            profilePhoto:
                "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e",
            bio: "Startup enthusiast and product builder.",
            likeCount: 910,
            postCount: 53,
            viewCount: 34410,
        },
        {
            fullName: "Ritu Malhotra",
            coverImage:
                "https://images.unsplash.com/photo-1528183429752-a97d0bf99b5a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8dHJlZXxlbnwwfHwwfHx8MA%3D%3D",
            profilePhoto:
                "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7",
            bio: "Student learning React and modern web tools.",
            likeCount: 520,
            postCount: 29,
            viewCount: 18760,
        },
        {
            fullName: "Arjun Mehta",
            coverImage:
                "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429",
            profilePhoto:
                "https://images.unsplash.com/photo-1545996124-0501ebae84d0",
            bio: "Product designer passionate about UX.",
            likeCount: 1120,
            postCount: 74,
            viewCount: 46800,
        },
        {
            fullName: "Kavya Iyer",
            coverImage:
                "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
            profilePhoto:
                "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e",
            bio: "Creative writer and blogger.",
            likeCount: 860,
            postCount: 52,
            viewCount: 31940,
        },
        {
            fullName: "Rohit Kulkarni",
            coverImage:
                "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d",
            profilePhoto:
                "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d",
            bio: "MERN stack developer.",
            likeCount: 1740,
            postCount: 118,
            viewCount: 64210,
        },
        {
            fullName: "Sneha Chatterjee",
            coverImage:
                "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
            profilePhoto:
                "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
            bio: "Lifestyle influencer and vlogger.",
            likeCount: 2890,
            postCount: 190,
            viewCount: 103500,
        },
        {
            fullName: "Manish Yadav",
            coverImage:
                "https://images.unsplash.com/photo-1503264116251-35a269479413",
            profilePhoto:
                "https://images.unsplash.com/photo-1527980965255-d3b416303d12",
            bio: "Self taught web developer.",
            likeCount: 730,
            postCount: 46,
            viewCount: 25680,
        },
        {
            fullName: "Ankita Joshi",
            coverImage:
                "https://images.unsplash.com/photo-1470770841072-f978cf4d019e",
            profilePhoto:
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
            bio: "Brand designer and illustrator.",
            likeCount: 1640,
            postCount: 91,
            viewCount: 58740,
        },
        {
            fullName: "Deepak Rana",
            coverImage:
                "https://images.unsplash.com/photo-1500534623283-312aade485b7",
            profilePhoto:
                "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61",
            bio: "Node.js and database enthusiast.",
            likeCount: 590,
            postCount: 38,
            viewCount: 21400,
        },
        {
            fullName: "Nikita Bansal",
            coverImage:
                "https://images.unsplash.com/photo-1502082553048-f009c37129b9",
            profilePhoto:
                "https://images.unsplash.com/photo-1524504388940-b1c1722653e1",
            bio: "Marketing analyst and SEO learner.",
            likeCount: 980,
            postCount: 63,
            viewCount: 36210,
        },
        {
            fullName: "Sandeep Kumar",
            coverImage:
                "https://images.unsplash.com/photo-1491553895911-0055eca6402d",
            profilePhoto:
                "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c",
            bio: "Tech blogger sharing daily tips.",
            likeCount: 1210,
            postCount: 84,
            viewCount: 45190,
        },
        {
            fullName: "Riya Sen",
            coverImage:
                "https://images.unsplash.com/photo-1500534314210-ecb2c3d4f4b3",
            profilePhoto:
                "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7",
            bio: "Student exploring frontend development.",
            likeCount: 480,
            postCount: 26,
            viewCount: 16900,
        },
        {
            fullName: "Aditya Malhotra",
            coverImage:
                "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
            profilePhoto:
                "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
            bio: "Startup founder and mentor.",
            likeCount: 3100,
            postCount: 210,
            viewCount: 120400,
        },
        {
            fullName: "Pallavi Deshpande",
            coverImage:
                "https://images.unsplash.com/photo-1503264116251-35a269479413",
            profilePhoto:
                "https://images.unsplash.com/photo-1524504388940-b1c1722653e1",
            bio: "HR professional turned creator.",
            likeCount: 940,
            postCount: 59,
            viewCount: 33780,
        },
        {
            fullName: "Naveen Reddy",
            coverImage:
                "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d",
            profilePhoto:
                "https://images.unsplash.com/photo-1527980965255-d3b416303d12",
            bio: "Python and data science learner.",
            likeCount: 860,
            postCount: 54,
            viewCount: 30840,
        },
        {
            fullName: "Ishita Kapoor",
            coverImage:
                "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
            profilePhoto:
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
            bio: "Fashion and styling content creator.",
            likeCount: 2670,
            postCount: 175,
            viewCount: 98560,
        },
        {
            fullName: "Aman Tiwari",
            coverImage:
                "https://images.unsplash.com/photo-1470770841072-f978cf4d019e",
            profilePhoto:
                "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d",
            bio: "Competitive programmer and tutor.",
            likeCount: 1320,
            postCount: 88,
            viewCount: 47420,
        },
        {
            fullName: "Shreya Mukherjee",
            coverImage:
                "https://images.unsplash.com/photo-1502082553048-f009c37129b9",
            profilePhoto:
                "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
            bio: "Travel diary and storytelling.",
            likeCount: 1890,
            postCount: 120,
            viewCount: 71230,
        },
        {
            fullName: "Harshit Jain",
            coverImage:
                "https://images.unsplash.com/photo-1500534623283-312aade485b7",
            profilePhoto:
                "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61",
            bio: "SaaS builder and indie hacker.",
            likeCount: 1010,
            postCount: 67,
            viewCount: 39800,
        },
        {
            fullName: "Megha Arora",
            coverImage:
                "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429",
            profilePhoto:
                "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7",
            bio: "Learning React and TypeScript.",
            likeCount: 560,
            postCount: 31,
            viewCount: 19450,
        },
        {
            fullName: "Kunal Saxena",
            coverImage:
                "https://images.unsplash.com/photo-1491553895911-0055eca6402d",
            profilePhoto:
                "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d",
            bio: "Tech reviewer and gadget lover.",
            likeCount: 1450,
            postCount: 97,
            viewCount: 55320,
        },
        {
            fullName: "Tanvi Kulshreshtha",
            coverImage:
                "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
            profilePhoto:
                "https://images.unsplash.com/photo-1524504388940-b1c1722653e1",
            bio: "Design student sharing daily work.",
            likeCount: 620,
            postCount: 35,
            viewCount: 22100,
        },
    ];

    return (
        <div className="flex gap-1.5 justify-center items-center bg-slate-800 h-screen flex-wrap overflow-auto">
            {users.map((user, index) => {
                return <Card key={index} user={user} />;
            })}
        </div>
    );
};

export default App;
