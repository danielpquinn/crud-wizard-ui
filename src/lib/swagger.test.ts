import { resolveAllReferences } from "src/lib/swagger";
import { petstore } from "src/specs/petstore";

it("resolves all references", () => {
  const resolved = resolveAllReferences(petstore);
  expect((resolved as any).paths["/pet"].post.parameters[0].schema.properties.category.properties.name.type).toEqual("string");
});
