import { useState } from "react";

const initialFriends = [
  // {
  //   id: 118836,
  //   name: "Clark",
  //   image: "https://i.pravatar.cc/48?u=118836",
  //   balance: -7,
  // },
  // {
  //   id: 933372,
  //   name: "Sarah",
  //   image: "https://i.pravatar.cc/48?u=933372",
  //   balance: 20,
  // },
  // {
  //   id: 499476,
  //   name: "Anthony",
  //   image: "https://i.pravatar.cc/48?u=499476",
  //   balance: 0,
  // },
];

export default function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [showAddFriend, setShowAddFriend] = useState(false);

  console.log(selectedFriend);
  function handleShowAddFriend() {
    setShowAddFriend((s) => !s);
  }
  function handleAddFriend(name, image) {
    const id = crypto.randomUUID();
    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };

    setFriends((friends) => [...friends, newFriend]);
    console.log(newFriend);
    setShowAddFriend(null);
  }
  function handleSelectedFriend(friend) {
    setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend));
  }

  return (
    <>
      <h1>🍕 Split Your Bills 💵 </h1>
      <div className="app">
        <div className="sidebar">
          <Friends
            friends={friends}
            selectedFriend={selectedFriend}
            onSelectedFriend={handleSelectedFriend}
          />
          {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}
          <Button onClick={handleShowAddFriend}>
            {showAddFriend ? "Close" : "Add Friend"}
          </Button>
        </div>
        {selectedFriend && (
          <FormSplitBill
            friend={selectedFriend}
            friends={friends}
            setFriends={setFriends}
            setSelectedFriend={setSelectedFriend}
          />
        )}
      </div>
    </>
  );
}

function Friends({ friends, selectedFriend, onSelectedFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          selectedFriend={selectedFriend}
          onSelectedFriend={onSelectedFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, selectedFriend, onSelectedFriend }) {
  const isSelected = selectedFriend?.id === friend.id;
  console.log(isSelected);
  return (
    <li>
      <img src={friend.image} alt={friend.image} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} ${Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you ${Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend.name} are even</p>}
      <button className="button" onClick={() => onSelectedFriend(friend)}>
        {isSelected ? "close" : "select"}
      </button>
    </li>
  );
}

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");
  function handleSubmit(e) {
    e.preventDefault();
    if (!name || !image) return;
    onAddFriend(name, image);
  }
  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>👫 Friend name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label>🌄 Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <Button onClick={handleSubmit}>Add</Button>
    </form>
  );
}

function FormSplitBill({ friend, friends, setFriends, setSelectedFriend }) {
  const [bill, setBill] = useState("");
  const [yourBill, setYourBill] = useState("");
  const [whoIsPaying, setWhoIsPaying] = useState("user");
  const friendBill = bill ? bill - yourBill : "";

  function handleSplit(e) {
    e.preventDefault();
    if (!bill || !yourBill) return;
    setFriends((fr) =>
      fr.map((f) =>
        f.id === friend.id
          ? {
              ...f,
              balance:
                whoIsPaying === "user"
                  ? f.balance + friendBill
                  : f.balance + -yourBill,
            }
          : f
      )
    );
    setSelectedFriend(null);
  }

  return (
    <form className="form-split-bill">
      <h2>Split a bill with {friend.name}</h2>
      <label>💰 Bill value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(e.target.value)}
      />
      <label>🧍‍♀️ Your expense</label>
      <input
        type="text"
        value={yourBill}
        onChange={(e) =>
          setYourBill(+e.target.value > bill ? yourBill : +e.target.value)
        }
      />
      <label>👫 {friend.name}'s expense</label>
      <input type="text" value={+friendBill} disabled />
      <label>🤑 Who is paying bill</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">you</option>
        <option value="friend">{friend.name}</option>
      </select>
      <Button onClick={handleSplit}>Split bill</Button>
    </form>
  );
}
