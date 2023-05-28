import { Link, useSearchParams } from "expo-router";
import { View, Image } from "react-native";
import { supabase } from "../lib/supabase";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text } from "react-native-paper";

export default function EditTodoPage() {
  const { id } = useSearchParams();
  const [todo, setTodo] = useState(null);

  useEffect(() => {
    console.log(`id before if: ${id}`);
    if (id != null) {
      const fetchTodo = async () => {
        console.log(`id: ${id}`);
        const { data } = await supabase
          .from("todos")
          .select("*")
          .eq("id", id)
          .single();
        console.log(data);
        setTodo(data);
      };
      fetchTodo();
    }
  }, [id]);
  if (todo == null) {
    return <ActivityIndicator />;
  }
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>{todo.task}</Text>
      {todo.image_url && (
        <Image
          source={{ uri: todo.image_url }}
          style={{ height: 200, width: 200 }}
        />
      )}
      <Link href="/">Go Back</Link>
    </View>
  );
}
