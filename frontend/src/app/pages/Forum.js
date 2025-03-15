"use client"; // Ensures this component runs on the client side

import { useState } from "react";

export default function Forum() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("general");
  const [newDiscussion, setNewDiscussion] = useState("");
  const [newReply, setNewReply] = useState("");
  const [discussions, setDiscussions] = useState({
    general: [
      { id: 1, title: "Welcome to Jme3tna Forum!", author: "Admin", replies: ["Thanks for creating this forum!"] },
      { id: 2, title: "How do I register as a volunteer?", author: "Sarah", replies: ["Go to the registration page!"] },
    ],
    events: [{ id: 3, title: "Upcoming Ramadan Charity Events", author: "Ali", replies: ["Looking forward to it!"] }],
    help: [{ id: 4, title: "I can't find my volunteering schedule", author: "Youssef", replies: ["Check your profile page."] }],
  });
  const [selectedDiscussion, setSelectedDiscussion] = useState(null);

  const handleAddDiscussion = () => {
    if (newDiscussion.trim() !== "") {
      const newPost = { id: Date.now(), title: newDiscussion, author: "You", replies: [] };
      setDiscussions((prev) => ({ ...prev, [activeCategory]: [...prev[activeCategory], newPost] }));
      setNewDiscussion("");
    }
  };

  const handleAddReply = () => {
    if (selectedDiscussion !== null && newReply.trim() !== "") {
      setDiscussions((prev) => {
        const updatedDiscussions = { ...prev };
        updatedDiscussions[activeCategory] = prev[activeCategory].map((post) =>
          post.id === selectedDiscussion.id ? { ...post, replies: [...post.replies, newReply] } : post
        );
        return updatedDiscussions;
      });
      setNewReply("");
    }
  };

  return (
    <div className="flex justify-center items-center ml-[200px] min-h-screen bg-white">
      <div className="bg-white shadow-md rounded-lg p-6 w-[600px]">
        {/* Forum Title */}
        <h1 className="text-3xl font-bold mb-4 text-center">Discussion Forum</h1>

        {/* Tabs for Categories */}
        <div className="flex justify-center gap-4 mb-4">
          {Object.keys(discussions).map((category) => (
            <button
              key={category}
              onClick={() => {
                setActiveCategory(category);
                setSelectedDiscussion(null);
              }}
              className={`px-4 py-2 rounded-md text-white ${
                activeCategory === category ? "bg-[#1B7F67]" : "bg-gray-300 hover:bg-gray-400"
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {/* Discussion List or Replies */}
        {selectedDiscussion ? (
          <div>
            <button onClick={() => setSelectedDiscussion(null)} className="mb-4 px-4 py-2 bg-gray-300 rounded-md">
              ⬅ Back to Discussions
            </button>
            <h2 className="text-xl font-semibold mb-2">{selectedDiscussion.title}</h2>
            <p className="text-sm text-gray-500">By {selectedDiscussion.author}</p>
            <div className="mt-4 border-t pt-4">
              <h3 className="text-lg font-semibold">Replies</h3>
              {selectedDiscussion.replies.map((reply, index) => (
                <p key={index} className="p-2 border rounded-md mb-2">{reply}</p>
              ))}
              <input
                type="text"
                placeholder="Add a reply..."
                className="w-full px-4 py-2 border rounded-md"
                value={newReply}
                onChange={(e) => setNewReply(e.target.value)}
              />
              <button onClick={handleAddReply} className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md w-full">
                Reply
              </button>
            </div>
          </div>
        ) : (
          <div>
            {discussions[activeCategory].map((post) => (
              <div
                key={post.id}
                className="border rounded-lg p-4 mb-4 shadow-sm bg-white cursor-pointer"
                onClick={() => setSelectedDiscussion(post)}
              >
                <h2 className="text-lg font-semibold">{post.title}</h2>
                <p className="text-sm text-gray-500">By {post.author} • {post.replies.length} replies</p>
              </div>
            ))}
            <input
              type="text"
              placeholder="Start a new discussion..."
              className="w-full px-4 py-2 border rounded-md"
              value={newDiscussion}
              onChange={(e) => setNewDiscussion(e.target.value)}
            />
            <button onClick={handleAddDiscussion} className="mt-2 px-4 py-2 bg-[#1B7F67] text-white rounded-md w-full">
              Post
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
