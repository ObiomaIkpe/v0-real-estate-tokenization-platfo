import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AdminPropertySummary } from "@/lib/services/admin.service";
import Link from "next/link";
import Image from "next/image";

interface PropertyCardProps {
  property: AdminPropertySummary;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "approved":
      return "bg-green-100 text-green-800 border-green-200";
    case "tokenized":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "rejected":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export default function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-0">
        {/* Property Image */}
        <div className="relative h-48 w-full">
          {property.thumbnailUrl ? (
            <Image
              src={property.thumbnailUrl}
              alt={property.propertyTitle}
              fill
              className="object-cover rounded-t-lg"
              onError={(e) => {
                // Fallback to placeholder if image fails to load
                e.currentTarget.src = "/placeholder-property.jpg";
              }}
            />
          ) : (
            <div className="h-full w-full bg-gray-200 rounded-t-lg flex items-center justify-center">
              <div className="text-gray-400 text-center">
                <svg
                  className="w-12 h-12 mx-auto mb-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-sm">No Image</p>
              </div>
            </div>
          )}

          {/* Status Badge */}
          <div className="absolute top-3 right-3">
            <Badge className={`${getStatusColor(property.status)} border`}>
              {property.status.charAt(0).toUpperCase() +
                property.status.slice(1)}
            </Badge>
          </div>
        </div>

        {/* Property Details */}
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2 text-gray-900 line-clamp-2">
            {property.propertyTitle}
          </h3>

          <p className="text-gray-600 text-sm mb-2">{property.location}</p>

          <p className="text-gray-800 font-medium mb-2">
            ${Number(property.requestedValue).toLocaleString()}
          </p>

          <p className="text-gray-500 text-xs mb-2">
            Owner: {property.ownerName}
          </p>

          <p className="text-gray-500 text-xs mb-4">
            Submitted: {new Date(property.createdAt).toLocaleDateString()}
          </p>

          {/* Action Button */}
          <Button asChild className="w-full">
            <Link href={`/admin/review/${property.id}`}>Review Property</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
