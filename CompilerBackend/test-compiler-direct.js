const { compileCode } = require('./compilers');

console.log("=== Direct Compiler Test ===\n");

// Test Java compilation directly
const javaCode = `
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int a = scanner.nextInt();
        int b = scanner.nextInt();
        System.out.println(a + b);
        scanner.close();
    }
}`;

console.log("Testing Java compilation...");
console.log("Language: java");
console.log("Code length:", javaCode.length);

compileCode("java", javaCode, "5 3", 5000, (result) => {
  console.log("Result:", result);
  if (result.error) {
    console.log("❌ Error:", result.error);
  } else {
    console.log("✅ Success:", result.output);
  }
}); 