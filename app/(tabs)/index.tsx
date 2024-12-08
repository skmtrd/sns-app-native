import { StyleSheet, FlatList, View, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Header from "@/components/ui/Header";

interface Post {
  id: string;
  author: string;
  content: string;
  timestamp: string;
}

export default function HomeScreen() {
  type User = {
    id: string;
    name: string;
    email: string;
    emailVerified: string | null;
    image: string;
    introduction: string;
    iconUrl: string;
    createdAt: string;
    updatedAt: string;
    tags?: {
      id: string;
      name: string;
      createdAt: string;
      updatedAt: string;
    }[];
  };

  type Like = {
    id: string;
    userId: string;
    postId: string;
    assignmentId: string | null;
    questionId: string | null;
    createdAt: string;
    updatedAt: string;
    user: User;
  };

  type Post = {
    id: string;
    content: string;
    authorId: string;
    imageUrl: string | null;
    createdAt: string;
    updatedAt: string;
    author: User;
    likes: Like[];
    replies: any[]; // 必要に応じて型を定義
  };

  type ApiResponse = {
    message: string;
    data: Post[];
  };

  // fetch関数
  const fetchPosts = async (): Promise<Post[]> => {
    try {
      const response = await fetch("https://iniad-sns.vercel.app/api/post");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data: ApiResponse = await response.json();
      return data.data;
    } catch (error) {
      console.error("Error fetching posts:", error);
      throw error;
    }
  };

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const fetchedPosts = await fetchPosts();
        setPosts(fetchedPosts);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Unknown error occurred")
        );
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  return (
    <ThemedView>
      <SafeAreaView>
        <Header />
        <ScrollView>
          {posts.map((item) => (
            <ThemedView key={item.id} style={styles.post}>
              <ThemedText type="defaultSemiBold">{item.author.name}</ThemedText>
              <ThemedText>{item.content}</ThemedText>
            </ThemedView>
          ))}
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  post: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    gap: 8,
  },
  timestamp: {
    fontSize: 12,
    color: "#666",
  },
});
