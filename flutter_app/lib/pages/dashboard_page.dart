import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../providers/shipments_provider.dart';
import 'create_shipment_page.dart';
import 'shipment_detail_page.dart';
import 'login_page.dart';

class DashboardPage extends StatefulWidget {
  final VoidCallback? onSendGiftRequested;
  const DashboardPage({super.key, this.onSendGiftRequested});

  @override
  State<DashboardPage> createState() => _DashboardPageState();
}

class _DashboardPageState extends State<DashboardPage> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      Provider.of<ShipmentsProvider>(context, listen: false).fetchShipments();
    });
  }

  Future<void> _refresh() async {
    await Provider.of<ShipmentsProvider>(context, listen: false).fetchShipments();
  }

  Color _getStatusColor(String status) {
    switch (status) {
      case 'Processing':
        return Colors.amber;
      case 'In Transit':
        return Colors.blue;
      case 'Delivered':
        return Colors.green;
      case 'Customs':
        return Colors.orange;
      case 'Picked Up':
        return Colors.purple;
      case 'Out For Delivery':
        return const Color(0xFFEC4899);
      case 'Delayed':
        return Colors.red;
      case 'Packed':
        return Colors.grey;
      default:
        return Colors.grey;
    }
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    final shipmentsProvider = Provider.of<ShipmentsProvider>(context);

    final user = authProvider.user;
    if (user == null) return const Scaffold(body: Center(child: CircularProgressIndicator()));

    final shipments = shipmentsProvider.shipments;
    final activeCount = shipments.where((s) => s['status'] != 'Delivered').length;
    final deliveredCount = shipments.where((s) => s['status'] == 'Delivered').length;
    
    // Sum declared value
    double totalValue = 0;
    for (var s in shipments) {
      totalValue += (s['value'] ?? 0).toDouble();
    }

    return Scaffold(
      backgroundColor: const Color(0xFFF9FAFB),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        title: Row(
          children: [
            CircleAvatar(
              backgroundColor: const Color(0xFFEC4899),
              radius: 18,
              child: Text(
                user['avatar'] ?? 'U',
                style: const TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                  fontSize: 12,
                ),
              ),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Hello, ${user['name'].split(' ')[0]} 👋',
                    style: GoogleFonts.outfit(
                      textStyle: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: Colors.black87,
                      ),
                    ),
                  ),
                  Text(
                    user['email'],
                    style: const TextStyle(
                      fontSize: 10,
                      color: Colors.black45,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
      body: RefreshIndicator(
        onRefresh: _refresh,
        color: const Color(0xFFEC4899),
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.all(20.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Stats Cards Grid
              Row(
                children: [
                  Expanded(
                    child: _buildStatCard(
                      'Active Gifts',
                      '$activeCount',
                      Icons.flight_takeoff_rounded,
                      Colors.blue.shade50,
                      Colors.blue.shade700,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _buildStatCard(
                      'Delivered',
                      '$deliveredCount',
                      Icons.mark_email_read_rounded,
                      Colors.green.shade50,
                      Colors.green.shade700,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _buildStatCard(
                      'Total Sent',
                      '\$${totalValue.toStringAsFixed(0)}',
                      Icons.monetization_on_rounded,
                      const Color(0xFFFCE7F3), // pink-100
                      const Color(0xFFBE185D), // pink-700
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 28),
              
              // Gifting activity section
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Your Gifting Activity',
                    style: GoogleFonts.outfit(
                      textStyle: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: Colors.black87,
                      ),
                    ),
                  ),
                  TextButton(
                    onPressed: _refresh,
                    child: const Text(
                      'Refresh',
                      style: TextStyle(
                        color: Color(0xFFEC4899),
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 10),

              if (shipmentsProvider.isLoading && shipments.isEmpty)
                const Padding(
                  padding: EdgeInsets.symmetric(vertical: 40.0),
                  child: Center(
                    child: CircularProgressIndicator(color: Color(0xFFEC4899)),
                  ),
                )
              else if (shipments.isEmpty)
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.symmetric(vertical: 48, horizontal: 16),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(24),
                    border: Border.all(color: Colors.black12.withOpacity(0.05)),
                  ),
                  child: Column(
                    children: [
                      const Icon(Icons.card_giftcard_rounded, size: 48, color: Colors.black26),
                      const SizedBox(height: 12),
                      const Text(
                        'No shipments registered yet',
                        style: TextStyle(fontWeight: FontWeight.bold, color: Colors.black54),
                      ),
                      const SizedBox(height: 4),
                      const Text(
                        'Tap the button below to send your first emotional gift!',
                        textAlign: TextAlign.center,
                        style: TextStyle(fontSize: 12, color: Colors.black38),
                      ),
                      const SizedBox(height: 16),
                      ElevatedButton.icon(
                        onPressed: () {
                          if (widget.onSendGiftRequested != null) {
                            widget.onSendGiftRequested!();
                          } else {
                            Navigator.push(
                              context,
                              MaterialPageRoute(builder: (_) => const CreateShipmentPage()),
                            );
                          }
                        },
                        icon: const Icon(Icons.add_circle_outline_rounded),
                        label: const Text('Send a Gift'),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFFEC4899),
                          foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        ),
                      ),
                    ],
                  ),
                )
              else
                ListView.separated(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: shipments.length,
                  separatorBuilder: (_, __) => const SizedBox(height: 12),
                  itemBuilder: (context, index) {
                    final s = shipments[index];
                    final statusColor = _getStatusColor(s['status'] ?? 'Processing');
                    
                    return InkWell(
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (_) => ShipmentDetailPage(shipment: s),
                          ),
                        );
                      },
                      borderRadius: BorderRadius.circular(20),
                      child: Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(color: Colors.black12.withOpacity(0.05)),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.02),
                              blurRadius: 10,
                              offset: const Offset(0, 4),
                            ),
                          ],
                        ),
                        child: Row(
                          children: [
                            Container(
                              width: 44,
                              height: 44,
                              decoration: BoxDecoration(
                                color: const Color(0xFFF3F4F6),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: const Icon(Icons.local_shipping_rounded, color: Colors.black54),
                            ),
                            const SizedBox(width: 14),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    s['item'] ?? 'Special Gift',
                                    style: const TextStyle(
                                      fontWeight: FontWeight.bold,
                                      fontSize: 14,
                                      color: Colors.black87,
                                    ),
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    'To: ${s['recipient']} | ${s['destination']}',
                                    style: const TextStyle(
                                      fontSize: 12,
                                      color: Colors.black45,
                                    ),
                                  ),
                                  const SizedBox(height: 2),
                                  Text(
                                    s['pin'] ?? '',
                                    style: TextStyle(
                                      fontSize: 10,
                                      fontFamily: 'monospace',
                                      color: const Color(0xFFEC4899).withOpacity(0.8),
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.end,
                              children: [
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                  decoration: BoxDecoration(
                                    color: statusColor.withOpacity(0.1),
                                    borderRadius: BorderRadius.circular(20),
                                    border: Border.all(color: statusColor.withOpacity(0.2)),
                                  ),
                                  child: Row(
                                    mainAxisSize: MainAxisSize.min,
                                    children: [
                                      Container(
                                        width: 5,
                                        height: 5,
                                        decoration: BoxDecoration(
                                          color: statusColor,
                                          shape: BoxShape.circle,
                                        ),
                                      ),
                                      const SizedBox(width: 5),
                                      Text(
                                        s['status'] ?? 'Processing',
                                        style: TextStyle(
                                          color: statusColor,
                                          fontSize: 10,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                                const SizedBox(height: 8),
                                const Icon(Icons.chevron_right_rounded, color: Colors.black26),
                              ],
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                ),
            ],
          ),
        ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {
          if (widget.onSendGiftRequested != null) {
            widget.onSendGiftRequested!();
          } else {
            Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => const CreateShipmentPage()),
            );
          }
        },
        backgroundColor: const Color(0xFFEC4899),
        icon: const Icon(Icons.add, color: Colors.white),
        label: Text(
          'Send a Gift',
          style: GoogleFonts.outfit(
            textStyle: const TextStyle(
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildStatCard(
    String title,
    String value,
    IconData icon,
    Color bgColor,
    Color iconColor,
  ) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.black12.withOpacity(0.05)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.01),
            blurRadius: 8,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                padding: const EdgeInsets.all(6),
                decoration: BoxDecoration(
                  color: bgColor,
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Icon(icon, color: iconColor, size: 18),
              ),
            ],
          ),
          const SizedBox(height: 14),
          Text(
            value,
            style: GoogleFonts.outfit(
              textStyle: const TextStyle(
                fontSize: 22,
                fontWeight: FontWeight.w900,
                color: Colors.black87,
              ),
            ),
          ),
          const SizedBox(height: 2),
          Text(
            title,
            style: const TextStyle(
              fontSize: 10,
              color: Colors.black38,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }
}
