import { Alert, FlatList, Pressable, View } from "react-native";
import { supabase } from "../../lib/supabase";
import { useEffect, useState } from "react";
import { Checkbox, Text } from "react-native-paper";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const [todos, setTodos] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  async function fetchTodos() {
    setRefreshing(true);
    let { data } = await supabase.from("todos").select("*");
    setRefreshing(false);
    setTodos(data);
  }

  useEffect(() => {
    fetchTodos();
  }, []);

  useEffect(() => {
    if (refreshing) {
      fetchTodos();
      setRefreshing(false);
    }
  }, [refreshing]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <FlatList
        data={todos}
        renderItem={({ item }) => <TodoItem todo={item} />}
        onRefresh={() => setRefreshing(true)}
        refreshing={refreshing}
      />
    </View>
  );
}

function TodoItem({ todo }) {
  const [checked, setChecked] = useState(todo.is_complete);
  const router = useRouter();
  const handleCheckboxPress = async () => {
    const { error } = await supabase
      .from("todos")
      .update({ is_complete: !checked })
      .eq("id", todo.id);
    if (error != null) {
      Alert.alert(error.message);
    }
    setChecked(!checked);
  };
  const handleItemPress = () => {
    router.push({ pathname: "/detailedTodo", params: { id: todo.id } });
  };
  return (
    <Pressable
      style={{ flexDirection: "row", alignItems: "center" }}
      onPress={handleItemPress}
    >
      <Text>{todo.task}</Text>
      <Checkbox.Android
        status={checked ? "checked" : "unchecked"}
        onPress={handleCheckboxPress}
      />
    </Pressable>
  );
}
