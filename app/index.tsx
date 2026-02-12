import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { supabase } from "../lib/supabase";

export default function Home() {
  const [status, setStatus] = useState("Testing connection...");

  useEffect(() => {
    const testConnection = async () => {
      const { data, error } = await supabase.from("_test").select("*").limit(1);

      if (error) {
        setStatus("Supabase connected ✅ (No table yet)");
      } else {
        setStatus("Supabase connected ✅");
      }
    };

    testConnection();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>{status}</Text>
    </View>
  );
}
