import React from 'react';
import Post from './Post';

const posts1 = [
    {avatarUrl: "https://i.makeagif.com/media/4-18-2018/8BLiwJ.gif",
     username: "Apostolof",
     subject: "Some very important topic of discussion2!",
     date: "May 25, 2018, 11:11:11",
     postIndex: "1",
     postContent: "# We have markdown!!!\n  \n**Oh yes we do!!**  \n*ITALICS*  \n  \n```Some code```",
     id: 2,
     address: 0x083c41ea13af6c2d5aaddf6e73142eb9a7b00183
    },
    {avatarUrl: "",
     username: "",
     subject: "Some very important topic of discussion!",
     date: "May 20, 2018, 10:10:10",
     postIndex: "",
     postContent: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequatur, natus ipsum minima.",
     id: 1,
     address: 0x5fe3062B24033113fbf52b2b75882890D7d8CA54
    }
];

const PostList = (props) => {
    const posts = posts1.map((post) =>
        <Post avatarUrl={post.avatarUrl}
        username={post.username}
        subject={post.subject}
        date={post.date}
        postIndex={post.postIndex}
        postContent={post.postContent}
        id={post.id}
        key={post.id}
        address={post.address}/>
    );

    return (
        <div className="posts-list">
            {posts}
        </div>
    );
};

export default PostList;