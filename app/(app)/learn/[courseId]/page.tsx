import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { CourseDetail } from "@/components/learning/course-detail"
import { COURSES, getCourse } from "@/lib/data/courses"

export function generateStaticParams() {
  return COURSES.map((c) => ({ courseId: c.id }))
}

export async function generateMetadata({ params }: PageProps<"/learn/[courseId]">): Promise<Metadata> {
  const { courseId } = await params
  return { title: getCourse(courseId)?.title ?? "Course" }
}

export default async function CoursePage({ params }: PageProps<"/learn/[courseId]">) {
  const { courseId } = await params
  if (!getCourse(courseId)) notFound()
  return <CourseDetail courseId={courseId} />
}
