import { createChild } from "@/lib/child-api";
import { bulkUploadFiles } from "@/lib/s3-api";
import type { RegisterChildDraft } from "@/stores/register-wizard.store";

export async function submitRegisterChildren(
  children: RegisterChildDraft[],
  permission: Record<string, boolean>,
) {
  for (const child of children) {
    const documentUrls =
      child.files.length > 0
        ? await bulkUploadFiles(child.files)
        : [];

    await createChild({
      userName: child.userName,
      grade: child.grade,
      pin: child.pin,
      documentUrls,
      permission,
    });
  }
}
