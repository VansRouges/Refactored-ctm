// app/api/traders/route.ts
import { NextResponse } from "next/server";
import { databases, ID } from "@/lib/appwrite";
import ENV from "@/constants/env";

const databaseId = ENV.databaseId;
const collectionId = ENV.collections.copyTrading;

export async function GET() {
  try {
    const response = await databases.listDocuments(databaseId, collectionId);
    console.log("Traders fetched successfully", response)
    const traders = response.documents.map((doc) => ({
      id: doc.$id,
      trade_title: doc.trade_title,
      trade_max: doc.trade_max,
      trade_min: doc.trade_min,
      trade_roi_min: doc.trade_roi_min,
      trade_roi_max: doc.trade_roi_max,
      trade_description: doc.trade_description,
      trade_risk: doc.trade_risk,
      trade_duration: doc.trade_duration,
      user_id: doc.user_id,
      user_name: doc.user_name,
    }));

    return NextResponse.json(traders);
  } catch (error) {
    console.error("Failed to fetch traders:", error);
    return NextResponse.json(
      { error: "Failed to fetch traders" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
    try {
      const { 
        trade_title,
        trade_max,
        trade_min,
        trade_description,
        trade_roi_min,
        trade_roi_max,
        trade_risk,
        trade_duration,
        user_id,
        user_name
      } = await request.json();
  
      const response = await databases.createDocument(
        databaseId,
        collectionId,
        ID.unique(),
        {
          trade_title,
          trade_max,
          trade_min,
          trade_description,
          trade_roi_min,
          trade_roi_max,
          trade_risk,
          trade_duration,
          user_id,
          user_name,
        }
      );
  
      return NextResponse.json({
        id: response.$id,
        ...response
      }, { status: 201 });
    } catch (error) {
      console.error("Failed to add trade:", error);
      return NextResponse.json(
        { error: "Failed to add trade" },
        { status: 500 }
      );
    }
  }

  export async function PUT(request: Request) {
    try {
      const { 
        id,
        trade_title,
        trade_max,
        trade_min,
        trade_description,
        trade_roi_min,
        trade_roi_max,
        trade_risk,
        trade_duration
      } = await request.json();
  
      await databases.updateDocument(
        databaseId,
        collectionId,
        id,
        {
          trade_title,
          trade_max,
          trade_min,
          trade_description,
          trade_roi_min,
          trade_roi_max,
          trade_risk,
          trade_duration
        }
      );
  
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error("Failed to update trade:", error);
      return NextResponse.json(
        { error: "Failed to update trade" },
        { status: 500 }
      );
    }
  }
  
  export async function DELETE(request: Request) {
    try {
      const { id } = await request.json();
      await databases.deleteDocument(databaseId, collectionId, id);
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error("Failed to delete trade:", error);
      return NextResponse.json(
        { error: "Failed to delete trade" },
        { status: 500 }
      );
    }
  }