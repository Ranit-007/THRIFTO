"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

const ProfileSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
});

export async function updateProfile(prevState: unknown, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  try {
    const validatedFields = ProfileSchema.safeParse({
      name: formData.get("name"),
    });

    if (!validatedFields.success) {
      return {
        error: "Invalid fields",
        validationErrors: validatedFields.error.flatten().fieldErrors,
      };
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: { name: validatedFields.data.name },
    });

    revalidatePath("/account/profile");
    return { success: true, message: "Profile updated successfully" };
  } catch (error) {
    console.error("Profile update error:", error);
    return { error: "Failed to update profile" };
  }
}

const AddressSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  addressLine1: z.string().min(5, "Address line 1 is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  postalCode: z.string().min(4, "Valid postal code is required"),
  country: z.string().min(2, "Country is required"),
  isDefault: z.boolean().optional().default(false),
});

export async function addAddress(prevState: unknown, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  try {
    const data = {
      fullName: formData.get("fullName") as string,
      phone: formData.get("phone") as string,
      addressLine1: formData.get("addressLine1") as string,
      addressLine2: formData.get("addressLine2") as string,
      city: formData.get("city") as string,
      state: formData.get("state") as string,
      postalCode: formData.get("postalCode") as string,
      country: formData.get("country") as string,
      isDefault: formData.get("isDefault") === "on",
    };

    const validatedFields = AddressSchema.safeParse(data);

    if (!validatedFields.success) {
      return {
        error: "Invalid fields",
        validationErrors: validatedFields.error.flatten().fieldErrors,
      };
    }

    if (validatedFields.data.isDefault) {
      await prisma.address.updateMany({
        where: { userId: session.user.id, isDefault: true },
        data: { isDefault: false },
      });
    } else {
      const existingAddress = await prisma.address.findFirst({
        where: { userId: session.user.id },
      });
      if (!existingAddress) {
        validatedFields.data.isDefault = true;
      }
    }

    await prisma.address.create({
      data: {
        ...validatedFields.data,
        userId: session.user.id,
      },
    });

    revalidatePath("/account/addresses");
    return { success: true, message: "Address added successfully" };
  } catch (error) {
    console.error("Add address error:", error);
    return { error: "Failed to add address" };
  }
}

export async function updateAddress(id: string, prevState: unknown, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  try {
    const data = {
      fullName: formData.get("fullName") as string,
      phone: formData.get("phone") as string,
      addressLine1: formData.get("addressLine1") as string,
      addressLine2: formData.get("addressLine2") as string,
      city: formData.get("city") as string,
      state: formData.get("state") as string,
      postalCode: formData.get("postalCode") as string,
      country: formData.get("country") as string,
      isDefault: formData.get("isDefault") === "on",
    };

    const validatedFields = AddressSchema.safeParse(data);

    if (!validatedFields.success) {
      return {
        error: "Invalid fields",
        validationErrors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const address = await prisma.address.findUnique({
      where: { id },
    });

    if (!address || address.userId !== session.user.id) {
      return { error: "Address not found or unauthorized" };
    }

    if (validatedFields.data.isDefault && !address.isDefault) {
      await prisma.address.updateMany({
        where: { userId: session.user.id, isDefault: true },
        data: { isDefault: false },
      });
    } else if (!validatedFields.data.isDefault && address.isDefault) {
      const otherAddress = await prisma.address.findFirst({
        where: { userId: session.user.id, id: { not: id } },
      });

      if (!otherAddress) {
        validatedFields.data.isDefault = true; // Must have one default if any exists
      } else {
        await prisma.address.update({
          where: { id: otherAddress.id },
          data: { isDefault: true },
        });
      }
    }

    await prisma.address.update({
      where: { id },
      data: validatedFields.data,
    });

    revalidatePath("/account/addresses");
    return { success: true, message: "Address updated successfully" };
  } catch (error) {
    console.error("Update address error:", error);
    return { error: "Failed to update address" };
  }
}

export async function deleteAddress(id: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  try {
    const address = await prisma.address.findUnique({
      where: { id },
    });

    if (!address || address.userId !== session.user.id) {
      return { error: "Address not found or unauthorized" };
    }

    await prisma.address.delete({
      where: { id },
    });

    if (address.isDefault) {
      const remainingAddress = await prisma.address.findFirst({
        where: { userId: session.user.id },
      });
      if (remainingAddress) {
        await prisma.address.update({
          where: { id: remainingAddress.id },
          data: { isDefault: true },
        });
      }
    }

    revalidatePath("/account/addresses");
    return { success: true };
  } catch (error) {
    console.error("Delete address error:", error);
    return { error: "Failed to delete address" };
  }
}

export async function setDefaultAddress(id: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  try {
    const address = await prisma.address.findUnique({
      where: { id },
    });

    if (!address || address.userId !== session.user.id) {
      return { error: "Address not found or unauthorized" };
    }

    await prisma.address.updateMany({
      where: { userId: session.user.id, isDefault: true },
      data: { isDefault: false },
    });

    await prisma.address.update({
      where: { id },
      data: { isDefault: true },
    });

    revalidatePath("/account/addresses");
    return { success: true };
  } catch (error) {
    console.error("Set default address error:", error);
    return { error: "Failed to set default address" };
  }
}