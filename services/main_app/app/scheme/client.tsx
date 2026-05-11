'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Database, Users, Award, Lock, Zap, Share2 } from 'lucide-react';

export default function SchemeClient() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-950 border-b border-slate-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition mb-4"
          >
            <ArrowLeft size={20} />
            Back
          </button>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-lg flex items-center justify-center">
              <Database size={32} className="text-slate-900" />
            </div>
            <h1 className="text-3xl font-bold text-white">System Architecture</h1>
          </div>
          <p className="text-slate-400">Understand the structure and relationships in the Transcendence system</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="bg-slate-950 border border-slate-700 rounded-t-lg sticky top-16 z-30">
          <div className="flex gap-8 px-6 border-b border-slate-700 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'entities', label: 'Entities', icon: '📦' },
              { id: 'relationships', label: 'Relationships', icon: '🔗' },
              { id: 'flow', label: 'Data Flow', icon: '⚡' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-4 font-semibold transition border-b-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-white border-blue-500'
                    : 'text-slate-400 border-transparent hover:text-white'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="bg-slate-800 border border-t-0 border-slate-700 rounded-b-lg p-8">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div className="bg-slate-700 rounded-lg p-8">
                <h2 className="text-2xl font-bold text-white mb-4">System Overview</h2>
                <p className="text-slate-300 mb-6">
                  Transcendence is a badge management and organization system that allows users to create organizations, manage members, and award badges for achievements and contributions.
                </p>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-slate-800 rounded-lg p-6 border border-slate-600">
                    <Users size={32} className="text-blue-400 mb-3" />
                    <h3 className="text-lg font-bold text-white mb-2">Users</h3>
                    <p className="text-slate-400 text-sm">
                      Individual accounts that can create and manage organizations, earn badges, and interact with other members.
                    </p>
                  </div>
                  <div className="bg-slate-800 rounded-lg p-6 border border-slate-600">
                    <Zap size={32} className="text-yellow-400 mb-3" />
                    <h3 className="text-lg font-bold text-white mb-2">Organizations</h3>
                    <p className="text-slate-400 text-sm">
                      Groups or teams created by users to manage members and award badges based on achievements.
                    </p>
                  </div>
                  <div className="bg-slate-800 rounded-lg p-6 border border-slate-600">
                    <Award size={32} className="text-orange-400 mb-3" />
                    <h3 className="text-lg font-bold text-white mb-2">Badges</h3>
                    <p className="text-slate-400 text-sm">
                      Achievements awarded to users within organizations, tracked with transaction history.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6">
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <Zap size={20} className="text-blue-400" />
                  Key Features
                </h3>
                <ul className="space-y-2 text-slate-300">
                  <li>✓ Multi-user organization management with role-based access</li>
                  <li>✓ Badge awarding system with configurable frequency</li>
                  <li>✓ Transaction tracking for badge awards</li>
                  <li>✓ User membership management</li>
                  <li>✓ Organization hierarchy and administration</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'entities' && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-white mb-6">Core Entities</h2>

              {/* User Entity */}
              <div className="bg-slate-700 rounded-lg p-6 border border-slate-600">
                <div className="flex items-center gap-3 mb-4">
                  <Users size={28} className="text-blue-400" />
                  <h3 className="text-xl font-bold text-white">User</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-600">
                        <th className="text-left py-2 px-3 text-slate-300 font-semibold">Field</th>
                        <th className="text-left py-2 px-3 text-slate-300 font-semibold">Type</th>
                        <th className="text-left py-2 px-3 text-slate-300 font-semibold">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-slate-600 hover:bg-slate-600">
                        <td className="py-2 px-3 text-white font-semibold">id</td>
                        <td className="py-2 px-3 text-cyan-400">Int (PK)</td>
                        <td className="py-2 px-3 text-slate-400">Unique user identifier</td>
                      </tr>
                      <tr className="border-b border-slate-600 hover:bg-slate-600">
                        <td className="py-2 px-3 text-white font-semibold">firstname</td>
                        <td className="py-2 px-3 text-cyan-400">String</td>
                        <td className="py-2 px-3 text-slate-400">User&apos;s first name</td>
                      </tr>
                      <tr className="border-b border-slate-600 hover:bg-slate-600">
                        <td className="py-2 px-3 text-white font-semibold">lastname</td>
                        <td className="py-2 px-3 text-cyan-400">String</td>
                        <td className="py-2 px-3 text-slate-400">User&apos;s last name</td>
                      </tr>
                      <tr className="border-b border-slate-600 hover:bg-slate-600">
                        <td className="py-2 px-3 text-white font-semibold">email</td>
                        <td className="py-2 px-3 text-cyan-400">String (Unique)</td>
                        <td className="py-2 px-3 text-slate-400">User&apos;s email address</td>
                      </tr>
                      <tr className="border-b border-slate-600 hover:bg-slate-600">
                        <td className="py-2 px-3 text-white font-semibold">phoneNumber</td>
                        <td className="py-2 px-3 text-cyan-400">String</td>
                        <td className="py-2 px-3 text-slate-400">User&apos;s contact number</td>
                      </tr>
                      <tr className="border-b border-slate-600 hover:bg-slate-600">
                        <td className="py-2 px-3 text-white font-semibold">role</td>
                        <td className="py-2 px-3 text-cyan-400">Enum</td>
                        <td className="py-2 px-3 text-slate-400">USER or ADMIN</td>
                      </tr>
                      <tr className="hover:bg-slate-600">
                        <td className="py-2 px-3 text-white font-semibold">createdAt</td>
                        <td className="py-2 px-3 text-cyan-400">DateTime</td>
                        <td className="py-2 px-3 text-slate-400">Account creation timestamp</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Organization Entity */}
              <div className="bg-slate-700 rounded-lg p-6 border border-slate-600">
                <div className="flex items-center gap-3 mb-4">
                  <Zap size={28} className="text-yellow-400" />
                  <h3 className="text-xl font-bold text-white">Organization</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-600">
                        <th className="text-left py-2 px-3 text-slate-300 font-semibold">Field</th>
                        <th className="text-left py-2 px-3 text-slate-300 font-semibold">Type</th>
                        <th className="text-left py-2 px-3 text-slate-300 font-semibold">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-slate-600 hover:bg-slate-600">
                        <td className="py-2 px-3 text-white font-semibold">id</td>
                        <td className="py-2 px-3 text-cyan-400">Int (PK)</td>
                        <td className="py-2 px-3 text-slate-400">Unique organization identifier</td>
                      </tr>
                      <tr className="border-b border-slate-600 hover:bg-slate-600">
                        <td className="py-2 px-3 text-white font-semibold">name</td>
                        <td className="py-2 px-3 text-cyan-400">String</td>
                        <td className="py-2 px-3 text-slate-400">Organization name</td>
                      </tr>
                      <tr className="border-b border-slate-600 hover:bg-slate-600">
                        <td className="py-2 px-3 text-white font-semibold">type</td>
                        <td className="py-2 px-3 text-cyan-400">String</td>
                        <td className="py-2 px-3 text-slate-400">Company, Team, Guild, etc.</td>
                      </tr>
                      <tr className="border-b border-slate-600 hover:bg-slate-600">
                        <td className="py-2 px-3 text-white font-semibold">service</td>
                        <td className="py-2 px-3 text-cyan-400">String</td>
                        <td className="py-2 px-3 text-slate-400">Service/department type</td>
                      </tr>
                      <tr className="border-b border-slate-600 hover:bg-slate-600">
                        <td className="py-2 px-3 text-white font-semibold">badgeTimes</td>
                        <td className="py-2 px-3 text-cyan-400">Int</td>
                        <td className="py-2 px-3 text-slate-400">Days between badge awards</td>
                      </tr>
                      <tr className="border-b border-slate-600 hover:bg-slate-600">
                        <td className="py-2 px-3 text-white font-semibold">adminId</td>
                        <td className="py-2 px-3 text-cyan-400">Int (FK)</td>
                        <td className="py-2 px-3 text-slate-400">Organization administrator</td>
                      </tr>
                      <tr className="hover:bg-slate-600">
                        <td className="py-2 px-3 text-white font-semibold">active</td>
                        <td className="py-2 px-3 text-cyan-400">Enum</td>
                        <td className="py-2 px-3 text-slate-400">TRUE or FALSE</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Badge Entity */}
              <div className="bg-slate-700 rounded-lg p-6 border border-slate-600">
                <div className="flex items-center gap-3 mb-4">
                  <Award size={28} className="text-orange-400" />
                  <h3 className="text-xl font-bold text-white">Badge</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-600">
                        <th className="text-left py-2 px-3 text-slate-300 font-semibold">Field</th>
                        <th className="text-left py-2 px-3 text-slate-300 font-semibold">Type</th>
                        <th className="text-left py-2 px-3 text-slate-300 font-semibold">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-slate-600 hover:bg-slate-600">
                        <td className="py-2 px-3 text-white font-semibold">number</td>
                        <td className="py-2 px-3 text-cyan-400">String (Unique)</td>
                        <td className="py-2 px-3 text-slate-400">Badge identifier #</td>
                      </tr>
                      <tr className="border-b border-slate-600 hover:bg-slate-600">
                        <td className="py-2 px-3 text-white font-semibold">userId</td>
                        <td className="py-2 px-3 text-cyan-400">Int (FK, PK)</td>
                        <td className="py-2 px-3 text-slate-400">User who earned badge</td>
                      </tr>
                      <tr className="border-b border-slate-600 hover:bg-slate-600">
                        <td className="py-2 px-3 text-white font-semibold">orgId</td>
                        <td className="py-2 px-3 text-cyan-400">Int (FK, PK)</td>
                        <td className="py-2 px-3 text-slate-400">Organization issuing badge</td>
                      </tr>
                      <tr className="hover:bg-slate-600">
                        <td className="py-2 px-3 text-white font-semibold">createdAt</td>
                        <td className="py-2 px-3 text-cyan-400">DateTime</td>
                        <td className="py-2 px-3 text-slate-400">Badge award timestamp</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'relationships' && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-white mb-6">Entity Relationships</h2>

              <div className="bg-slate-700 rounded-lg p-8 border border-slate-600">
                <svg viewBox="0 0 800 600" className="w-full h-auto">
                  {/* User Box */}
                  <rect x="50" y="50" width="180" height="140" fill="#1e293b" stroke="#0ea5e9" strokeWidth="2" rx="8" />
                  <text x="140" y="80" textAnchor="middle" className="text-lg font-bold" fill="#fff">User</text>
                  <line x1="50" y1="95" x2="230" y2="95" stroke="#0ea5e9" />
                  <text x="60" y="115" className="text-sm" fill="#e2e8f0">id (PK)</text>
                  <text x="60" y="135" className="text-sm" fill="#e2e8f0">email (Unique)</text>
                  <text x="60" y="155" className="text-sm" fill="#e2e8f0">firstname, lastname</text>
                  <text x="60" y="175" className="text-sm" fill="#e2e8f0">role</text>

                  {/* Organization Box */}
                  <rect x="420" y="50" width="200" height="140" fill="#1e293b" stroke="#eab308" strokeWidth="2" rx="8" />
                  <text x="520" y="80" textAnchor="middle" className="text-lg font-bold" fill="#fff">Organization</text>
                  <line x1="420" y1="95" x2="620" y2="95" stroke="#eab308" />
                  <text x="430" y="115" className="text-sm" fill="#e2e8f0">id (PK)</text>
                  <text x="430" y="135" className="text-sm" fill="#e2e8f0">name, type, service</text>
                  <text x="430" y="155" className="text-sm" fill="#e2e8f0">adminId (FK)</text>
                  <text x="430" y="175" className="text-sm" fill="#e2e8f0">badgeTimes</text>

                  {/* Badge Box */}
                  <rect x="220" y="350" width="180" height="140" fill="#1e293b" stroke="#f97316" strokeWidth="2" rx="8" />
                  <text x="310" y="380" textAnchor="middle" className="text-lg font-bold" fill="#fff">Badge</text>
                  <line x1="220" y1="395" x2="400" y2="395" stroke="#f97316" />
                  <text x="230" y="415" className="text-sm" fill="#e2e8f0">number (Unique)</text>
                  <text x="230" y="435" className="text-sm" fill="#e2e8f0">userId (FK, PK)</text>
                  <text x="230" y="455" className="text-sm" fill="#e2e8f0">orgId (FK, PK)</text>
                  <text x="230" y="475" className="text-sm" fill="#e2e8f0">createdAt</text>

                  {/* Relationships */}
                  {/* User to Organization (admin) */}
                  <line x1="230" y1="120" x2="420" y2="120" stroke="#06b6d4" strokeWidth="2" strokeDasharray="5,5" />
                  <text x="325" y="110" textAnchor="middle" className="text-xs" fill="#06b6d4">administers</text>

                  {/* User to Badge */}
                  <path d="M 140 190 Q 220 270 280 350" stroke="#0ea5e9" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" />
                  <text x="180" y="270" className="text-xs" fill="#0ea5e9">earns</text>

                  {/* Organization to Badge */}
                  <path d="M 500 190 Q 400 270 340 350" stroke="#eab308" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" />
                  <text x="420" y="270" className="text-xs" fill="#eab308">awards</text>

                  {/* User to Organization (member) */}
                  <line x1="230" y1="150" x2="420" y2="150" stroke="#10b981" strokeWidth="2" strokeDasharray="5,5" />
                  <text x="325" y="170" textAnchor="middle" className="text-xs" fill="#10b981">member_of</text>

                  <defs>
                    <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                      <polygon points="0 0, 10 3, 0 6" fill="#0ea5e9" />
                    </marker>
                  </defs>
                </svg>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-slate-700 rounded-lg p-6 border border-slate-600">
                  <h3 className="text-white font-bold mb-3">User → Organization</h3>
                  <p className="text-slate-400 text-sm mb-3">A user can:</p>
                  <ul className="space-y-1 text-slate-300 text-sm">
                    <li>✓ Create and administer organizations</li>
                    <li>✓ Be a member of multiple organizations</li>
                    <li>✓ Award badges within owned orgs</li>
                  </ul>
                </div>
                <div className="bg-slate-700 rounded-lg p-6 border border-slate-600">
                  <h3 className="text-white font-bold mb-3">Organization → Badge</h3>
                  <p className="text-slate-400 text-sm mb-3">An organization:</p>
                  <ul className="space-y-1 text-slate-300 text-sm">
                    <li>✓ Issues badges to members</li>
                    <li>✓ Controls award frequency</li>
                    <li>✓ Maintains member records</li>
                  </ul>
                </div>
                <div className="bg-slate-700 rounded-lg p-6 border border-slate-600">
                  <h3 className="text-white font-bold mb-3">User → Badge</h3>
                  <p className="text-slate-400 text-sm mb-3">A user can:</p>
                  <ul className="space-y-1 text-slate-300 text-sm">
                    <li>✓ Earn badges from orgs</li>
                    <li>✓ View badge history</li>
                    <li>✓ Track transactions</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'flow' && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-white mb-6">Data Flow</h2>

              <div className="space-y-6">
                {/* User Registration */}
                <div className="bg-slate-700 rounded-lg p-6 border border-slate-600">
                  <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">1</span>
                    User Registration & Authentication
                  </h3>
                  <div className="space-y-2 text-slate-300 text-sm">
                    <p>→ User creates account with email, password, name, phone</p>
                    <p>→ System hashes password and stores in User table</p>
                    <p>→ JWT token generated for session management</p>
                    <p>→ User assigned default USER role</p>
                  </div>
                </div>

                {/* Organization Creation */}
                <div className="bg-slate-700 rounded-lg p-6 border border-slate-600">
                  <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white text-sm">2</span>
                    Organization Creation
                  </h3>
                  <div className="space-y-2 text-slate-300 text-sm">
                    <p>→ User creates new organization with name, type, service</p>
                    <p>→ Organization stored with user as adminId</p>
                    <p>→ Badge frequency and callback URL configured</p>
                    <p>→ Organization status set to inactive until activated</p>
                  </div>
                </div>

                {/* Member Management */}
                <div className="bg-slate-700 rounded-lg p-6 border border-slate-600">
                  <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm">3</span>
                    Member Management
                  </h3>
                  <div className="space-y-2 text-slate-300 text-sm">
                    <p>→ Admin invites users to organization</p>
                    <p>→ UsersOnOrganizations entry created</p>
                    <p>→ Member gains access to org dashboards</p>
                    <p>→ Member role can be USER or ADMIN</p>
                  </div>
                </div>

                {/* Badge Awarding */}
                <div className="bg-slate-700 rounded-lg p-6 border border-slate-600">
                  <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm">4</span>
                    Badge Awarding Process
                  </h3>
                  <div className="space-y-2 text-slate-300 text-sm">
                    <p>→ Admin awards badge to member</p>
                    <p>→ Badge entry created with unique number</p>
                    <p>→ Badge linked to User and Organization</p>
                    <p>→ BadgeTX transaction record created</p>
                    <p>→ Optional callback webhook fired to callBackURL</p>
                  </div>
                </div>

                {/* Badge History */}
                <div className="bg-slate-700 rounded-lg p-6 border border-slate-600">
                  <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm">5</span>
                    Badge History & Transactions
                  </h3>
                  <div className="space-y-2 text-slate-300 text-sm">
                    <p>→ Each badge award creates a BadgeTX record</p>
                    <p>→ Transaction linked to badge number</p>
                    <p>→ Timestamp recorded for audit trail</p>
                    <p>→ Users can view complete badge history</p>
                  </div>
                </div>
              </div>

              {/* API Endpoints */}
              <div className="bg-slate-700 rounded-lg p-6 border border-slate-600">
                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                  <Share2 size={20} />
                  Available API Endpoints
                </h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="bg-slate-800 rounded p-4">
                    <p className="text-cyan-400 font-semibold mb-2">Authentication</p>
                    <p className="text-slate-300">POST /api/auth/login</p>
                    <p className="text-slate-300">POST /api/auth/register</p>
                    <p className="text-slate-300">POST /api/auth/logout</p>
                  </div>
                  <div className="bg-slate-800 rounded p-4">
                    <p className="text-cyan-400 font-semibold mb-2">Organizations</p>
                    <p className="text-slate-300">POST /api/organization/create</p>
                    <p className="text-slate-300">POST /api/organization/edit</p>
                    <p className="text-slate-300">POST /api/organization/addUser</p>
                    <p className="text-slate-300">POST /api/organization/removeUser</p>
                  </div>
                  <div className="bg-slate-800 rounded p-4">
                    <p className="text-cyan-400 font-semibold mb-2">Badges</p>
                    <p className="text-slate-300">POST /api/badge/create</p>
                    <p className="text-slate-300">POST /api/badge/receive</p>
                    <p className="text-slate-300">POST /api/badge/delete</p>
                  </div>
                  <div className="bg-slate-800 rounded p-4">
                    <p className="text-cyan-400 font-semibold mb-2">Admin</p>
                    <p className="text-slate-300">POST /api/createAdmin</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
